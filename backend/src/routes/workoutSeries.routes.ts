import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { WorkoutSeriesRepository } from '../repositories/WorkoutSeriesRepository.js'
import { WorkoutSeriesService } from '../services/WorkoutSeriesService.js'
import { WorkoutSeriesController } from '../controllers/WorkoutSeriesController.js'
import { authenticate } from '../middlewares/authenticate.js'

const router = Router()
const controller = new WorkoutSeriesController(new WorkoutSeriesService(new WorkoutSeriesRepository(prisma)))

router.use(authenticate)
router.get('/', controller.list)
router.get('/:id', controller.getById)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router
