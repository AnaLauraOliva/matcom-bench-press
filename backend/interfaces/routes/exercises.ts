import { Router } from 'express'
import { ExerciseController } from '../controllers/exercises'

export const ExercisesRouter = Router()

//get all exercises
ExercisesRouter.get('/',ExerciseController.getAll)

//get exercises by ID
ExercisesRouter.get('/:id',ExerciseController.getById)