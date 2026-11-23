import type { ExerciseRepository } from '../../ports/ExerciseRepository'
import type { CreateExerciseInput } from '../../../domain/entities/Exercise'

/** Registra un ejercicio con un tipo y uno o varios grupos musculares. */
export class CreateExercise {
  private readonly repository: ExerciseRepository

  constructor(repository: ExerciseRepository) {
    this.repository = repository
  }

  execute(input: CreateExerciseInput) {
    return this.repository.create(input)
  }
}
