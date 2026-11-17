import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserService } from '../services/UserService.js'
import { UserController } from '../controllers/UserController.js'
import { authenticate } from '../middlewares/authenticate.js'

const router = Router()
const controller = new UserController(new UserService(new UserRepository(prisma)))

router.post('/', controller.create)
router.get('/me', authenticate, controller.me)
router.put('/:id', authenticate, controller.update)

export default router
