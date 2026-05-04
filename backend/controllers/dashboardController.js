import mongoose from 'mongoose'
import Task from '../models/Task.js'
import Project from '../models/Project.js'
import User from '../models/User.js'

/**
 * GET /api/dashboard — counts scoped by role (admin: all tasks; member: assigned only).
 */
export async function getDashboardStats(req, res) {
  try {
    const now = new Date()

    let baseFilter = {}
    if (req.user.role !== 'admin') {
      const uid = String(req.user.id)
      if (!mongoose.isValidObjectId(uid)) {
        return res.status(400).json({ message: 'Invalid user identifier' })
      }
      baseFilter = { assignedTo: new mongoose.Types.ObjectId(uid) }
    }

    const overdueFilter = {
      ...baseFilter,
      status: { $ne: 'completed' },
      deadline: { $lt: now },
    }

    const ongoingFilter = {
      ...baseFilter,
      status: { $in: ['pending', 'in-progress'] },
    }

    const [totalTasks, completedTasks, ongoingTasks, overdueTasks] = await Promise.all([
      Task.countDocuments(baseFilter),
      Task.countDocuments({ ...baseFilter, status: 'completed' }),
      Task.countDocuments(ongoingFilter),
      Task.countDocuments(overdueFilter),
    ])

    const payload = {
      totalTasks,
      assignedTasks: totalTasks,
      completedTasks,
      ongoingTasks,
      overdueTasks,
    }

    if (req.user.role === 'admin') {
      const [totalProjects, totalUsers, users, groupedTasks] = await Promise.all([
        Project.countDocuments(),
        User.countDocuments(),
        User.find().sort({ name: 1 }).select('name email role').lean(),
        Task.aggregate([
          {
            $group: {
              _id: '$assignedTo',
              assignedTasks: { $sum: 1 },
              completedTasks: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
              },
              ongoingTasks: {
                $sum: { $cond: [{ $in: ['$status', ['pending', 'in-progress']] }, 1, 0] },
              },
              overdueTasks: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ['$status', 'completed'] },
                        { $lt: ['$deadline', now] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]),
      ])

      const taskCountsByUser = new Map(groupedTasks.map((row) => [String(row._id), row]))

      payload.totalProjects = totalProjects
      payload.totalUsers = totalUsers
      payload.userStats = users.map((user) => {
        const counts = taskCountsByUser.get(String(user._id)) || {}
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          assignedTasks: Number(counts.assignedTasks) || 0,
          completedTasks: Number(counts.completedTasks) || 0,
          ongoingTasks: Number(counts.ongoingTasks) || 0,
          overdueTasks: Number(counts.overdueTasks) || 0,
        }
      })
    }

    return res.json(payload)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to load dashboard statistics' })
  }
}
