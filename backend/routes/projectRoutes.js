import { Router } from 'express'
import mongoose from 'mongoose'
import Project from '../models/Project.js'
import User from '../models/User.js'
import { protect, isAdmin } from '../middleware/authMiddleware.js'

const router = Router()

function shapeProject(project) {
  return {
    _id: project._id,
    name: project.name,
    createdBy: project.createdBy,
    members: Array.isArray(project.members)
      ? project.members.map((m) =>
          typeof m === 'object' && m
            ? { _id: m._id, name: m.name, email: m.email }
            : m,
        )
      : [],
  }
}

async function findPopulatedProject(projectId) {
  return Project.findById(projectId).populate('members', 'name email').lean()
}

router.get('/', protect, async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { members: new mongoose.Types.ObjectId(String(req.user.id)) }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: 'members', select: 'name email' })
      .lean()

    res.json({ projects: projects.map(shapeProject) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch projects' })
  }
})

router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' })
    }

    let createdBy
    try {
      createdBy = new mongoose.Types.ObjectId(String(req.user.id))
    } catch {
      return res.status(400).json({ message: 'Invalid user context' })
    }

    const creatorExists = await User.exists({ _id: createdBy })
    if (!creatorExists) {
      return res.status(400).json({ message: 'User not found' })
    }

    const project = await Project.create({
      name,
      createdBy,
      members: [createdBy],
    })

    const populated = await findPopulatedProject(project._id)

    res.status(201).json({
      project: shapeProject(populated),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create project' })
  }
})

router.put('/:id/members', protect, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body || {}

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid project ID' })
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    const [projectExists, userExists] = await Promise.all([
      Project.exists({ _id: id }),
      User.exists({ _id: userId }),
    ])

    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' })
    }

    if (!userExists) {
      return res.status(400).json({ message: 'User not found' })
    }

    await Project.updateOne({ _id: id }, { $addToSet: { members: userId } })
    const project = await findPopulatedProject(id)

    return res.json({ project: shapeProject(project) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to add project member' })
  }
})

router.delete('/:id/members/:userId', protect, isAdmin, async (req, res) => {
  try {
    const { id, userId } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid project ID' })
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    const project = await Project.findById(id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    if (String(project.createdBy) === String(userId)) {
      return res.status(400).json({ message: 'Project creator cannot be removed' })
    }

    project.members = project.members.filter((memberId) => String(memberId) !== String(userId))
    await project.save()

    const populated = await findPopulatedProject(id)
    return res.json({ project: shapeProject(populated) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to remove project member' })
  }
})

export default router
