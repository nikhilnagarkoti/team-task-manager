import { Router } from 'express'
import { protect, isAdmin } from '../middleware/authMiddleware.js'
import { createTask, getTasks, updateTaskStatus } from '../controllers/taskController.js'

const router = Router()

router.post('/', protect, isAdmin, createTask)
router.get('/', protect, getTasks)
router.put('/:id', protect, updateTaskStatus)

export default router
