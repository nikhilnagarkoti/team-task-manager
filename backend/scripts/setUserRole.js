import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'

const [, , emailArg, roleArg] = process.argv
const email = String(emailArg || '').trim().toLowerCase()
const role = String(roleArg || '').trim().toLowerCase()

if (!email || !['admin', 'member'].includes(role)) {
  console.error('Usage: npm.cmd run set-role -- user@example.com admin')
  console.error('Roles: admin, member')
  process.exit(1)
}

try {
  await connectDB()
  const user = await User.findOneAndUpdate(
    { email },
    { role },
    { new: true, runValidators: true },
  ).select('name email role')

  if (!user) {
    console.error(`No user found with email: ${email}`)
    process.exitCode = 1
  } else {
    console.log(`${user.email} is now ${user.role}`)
  }
} catch (err) {
  console.error(err)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
