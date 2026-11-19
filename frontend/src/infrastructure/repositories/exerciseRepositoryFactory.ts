import type { ExerciseRepository } from '../../application/ports/ExerciseRepository'
import { HttpExerciseRepository } from './HttpExerciseRepository'
import { MockExerciseRepository } from './MockExerciseRepository'

/** Selecciona el adaptador del banco según la configuración de entorno. */
export function createExerciseRepository(): ExerciseRepository {
  return import.meta.env.VITE_USE_MOCK === 'false'
    ? new HttpExerciseRepository()
    : new MockExerciseRepository()
}
