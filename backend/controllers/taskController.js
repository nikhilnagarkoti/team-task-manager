import mongoose from 'mongoose'
import Task from '../models/Task.js'
import User from '../models/User.js'
import Project from '../models/Project.js'

const STATUS_VALUES = ['pending', 'in-progress', 'completed']

async function fetchTaskPayload(taskDoc) {
  return Task.findById(taskDoc._id)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'name')
    .lean()
}

/**
 * Admin only via route middleware. Validates refs and persists.
 */
export async function createTask(req, res) {
  try {
    const { title, description, deadline, assignedTo, projectId } = req.body || {}

    const titleStr = typeof title === 'string' ? title.trim() : ''
    if (!titleStr) {
      return res.status(400).json({ message: 'Title is required' })
    }

    if (!assignedTo) {
      return res.status(400).json({ message: 'assignedTo (User ID) is required' })
    }

    if (!projectId) {
      return res.status(400).json({ message: 'projectId is required' })
    }

    if (!mongoose.isValidObjectId(assignedTo)) {
      return res.status(400).json({ message: 'Invalid assigned user ID' })
    }

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' })
    }

    const assigneeExists = await User.exists({ _id: assignedTo })
    if (!assigneeExists) {
      return res.status(400).json({ message: 'Assigned user does not exist' })
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(400).json({ message: 'Project does not exist' })
    }

    if (!project.members.some((memberId) => String(memberId) === String(assignedTo))) {
      return res.status(400).json({ message: 'Assigned user must be a project member' })
    }

    let deadlineDate
    if (deadline !== undefined && deadline !== null && deadline !== '') {
      deadlineDate = new Date(deadline)
      if (Number.isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ message: 'Invalid deadline date' })
      }
    }

    const task = await Task.create({
      title: titleStr,
      description: typeof description === 'string' ? description.trim() : '',
      assignedTo,
      projectId,
      deadline: deadlineDate,
    })

    const payload = await fetchTaskPayload(task)
    return res.status(201).json({ task: payload })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to create task' })
  }
}

/**
 * Members: only tasks assigned to them. Admins: all tasks.
 */
export async function getTasks(req, res) {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { assignedTo: new mongoose.Types.ObjectId(String(req.user.id)) }

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name')
      .lean()

    return res.json({ tasks })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to fetch tasks' })
  }
}

/**
 * Only the assignee may update. Body: { status } only.
 */
export async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body ?? {}

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task ID' })
    }

    if (!STATUS_VALUES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status — must be one of: ${STATUS_VALUES.join(', ')}`,
      })
    }

    const task = await Task.findById(id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const isAdmin = req.user.role === 'admin'

    // Only admin can undo a completed task
    if (task.status === 'completed' && !isAdmin) {
      return res.status(403).json({
        message: 'Unauthorized — only an admin can change a completed task',
      })
    }

    // Non-admins may only update tasks assigned to them
    if (!isAdmin && String(task.assignedTo) !== String(req.user.id)) {
      return res.status(403).json({
        message: 'Unauthorized — only the assigned user may update status',
      })
    }

    task.status = status
    await task.save()

    const payload = await fetchTaskPayload(task)
    return res.json({ task: payload })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to update task' })
  }
}
