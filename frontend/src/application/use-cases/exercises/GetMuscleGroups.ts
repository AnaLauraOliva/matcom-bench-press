import type { ExerciseRepository } from '../../ports/ExerciseRepository'

/** Obtiene los grupos musculares disponibles para clasificar ejercicios. */
export class GetMuscleGroups {
  private readonly repository: ExerciseRepository

  constructor(repository: ExerciseRepository) {
    this.repository = repository
  }

  execute() {
    return this.repository.getMuscleGroups()
  }
}
