import { Request, Response } from 'express';
import { ExercisesModel } from '../../infrastructure/models/local/exercises.ts'

export class ExerciseController {
    static async getAll (req : Request, res: Response) {
        const exercises = await ExercisesModel.getAll()
        res.json(exercises)
    }

  static async getById (req : Request<{ id: string }>, res : Response) {
    const { id } = req.params
    const exercise = await ExercisesModel.getById({ id })
    
    if (exercise) return res.json(exercise)
    return res.status(404).json({ message: 'Exercise not found' })
  }
}