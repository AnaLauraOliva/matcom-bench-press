import { Router } from 'express'
import { ExerciseController } from '../controllers/exercises.ts'

export const ExercisesRouter = Router()

//get all exercises
ExercisesRouter.get('/',ExerciseController.getAll)

//get exercise by ID
ExercisesRouter.get('/:id',ExerciseController.getById)

//delete exercise by ID
ExercisesRouter.delete('/:id',ExerciseController.delete)