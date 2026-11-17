import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { AuthService } from '../services/AuthService.js'
import { AuthController } from '../controllers/AuthController.js'

const router = Router()
const controller = new AuthController(new AuthService(new UserRepository(prisma)))

router.post('/login', controller.login)

export default router
