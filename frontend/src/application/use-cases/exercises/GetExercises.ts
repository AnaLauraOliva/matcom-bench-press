import type { ExerciseRepository } from '../../ports/ExerciseRepository'

/** Obtiene todos los ejercicios registrados en el banco. */
export class GetExercises {
  private readonly repository: ExerciseRepository

  constructor(repository: ExerciseRepository) {
    this.repository = repository
  }

  execute() {
    return this.repository.getAll()
  }
}
