import { Router } from 'express'
import User from '../models/User.js'
import { protect, isAdmin } from '../middleware/authMiddleware.js'

const router = Router()

/**
 * GET /api/users — list users (helpful when admins assign tasks).
 */
router.get('/', protect, isAdmin, async (_req, res) => {
  try {
    const users = await User.find().sort({ name: 1 }).select('name email role').lean()

    const shaped = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
    }))

    return res.json({ users: shaped })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to fetch users' })
  }
})

export default router
