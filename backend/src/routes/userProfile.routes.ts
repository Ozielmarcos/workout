import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { UserProfileRepository } from '../repositories/UserProfileRepository.js'
import { UserProfileService } from '../services/UserProfileService.js'
import { UserProfileController } from '../controllers/UserProfileController.js'
import { authenticate } from '../middlewares/authenticate.js'

const router = Router()
const controller = new UserProfileController(new UserProfileService(new UserProfileRepository(prisma)))

router.use(authenticate)
router.get('/', controller.get)
router.post('/', controller.create)
router.put('/', controller.update)
router.delete('/', controller.delete)

export default router
