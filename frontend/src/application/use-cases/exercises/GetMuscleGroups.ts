import type { ExerciseRepository } from '../../ports/ExerciseRepository'

/** Obtiene los grupos musculares disponibles para clasificar ejercicios. */
export class GetMuscleGroups {
  constructor(private readonly repository: ExerciseRepository) {}

  execute() {
    return this.repository.getMuscleGroups()
  }
}
