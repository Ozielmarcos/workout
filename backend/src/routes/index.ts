import { Router } from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import exerciseRoutes from './exercise.routes.js'
import userProfileRoutes from './userProfile.routes.js'
import workoutSeriesRoutes from './workoutSeries.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/exercises', exerciseRoutes)
router.use('/profile', userProfileRoutes)
router.use('/workout-series', workoutSeriesRoutes)

export default router
