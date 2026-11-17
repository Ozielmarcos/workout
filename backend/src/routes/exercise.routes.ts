import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { ExerciseRepository } from '../repositories/ExerciseRepository.js'
import { ExerciseService } from '../services/ExerciseService.js'
import { ExerciseController } from '../controllers/ExerciseController.js'
import { authenticate } from '../middlewares/authenticate.js'

const router = Router()
const controller = new ExerciseController(new ExerciseService(new ExerciseRepository(prisma)))

router.use(authenticate)
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router
