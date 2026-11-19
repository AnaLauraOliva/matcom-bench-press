import type { ExerciseRepository } from '../../ports/ExerciseRepository'

/** Obtiene todos los ejercicios registrados en el banco. */
export class GetExercises {
  constructor(private readonly repository: ExerciseRepository) {}

  execute() {
    return this.repository.getAll()
  }
}
