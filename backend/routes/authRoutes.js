import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET

const router = Router()

function signToken(user) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign(
    {
      id: String(user._id),
      role: String(user.role).toLowerCase(),
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  )
}

function publicUser(u) {
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
  }
}

router.post('/signup', async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ msg: 'Server misconfiguration (JWT_SECRET missing)' })
    }

    const { name, email, password } = req.body || {}

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(String(password), salt)

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'member',
    })

    const token = signToken(user)
    res.status(201).json({
      token,
      user: publicUser(user),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Server error during signup' })
  }
})

router.post('/login', async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ msg: 'Server misconfiguration (JWT_SECRET missing)' })
    }

    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user)

    res.json({
      token,
      user: publicUser(user),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Server error during login' })
  }
})

export default router
