import type { Exercise, ExerciseType, IntensityLevel, MuscleGroup } from '../../domain/entities/Exercise'
import type { RoutineBlockKind } from '../../domain/entities/GeneratedRoutine'

/** Grupo muscular del API de backend. */
export type ApiMuscleGroup = {
  idGroup: number
  name: string
}

/** Tipo del ejercicio en el API de backend. */
export type ApiExerciseType = 'FUERZA' | 'CARDIO' | 'FLEXIBILIDAD'

/** Intensidad del ejercicio en el API de backend. */
export type ApiIntensityLevel = 'BAJA' | 'MEDIA' | 'ALTA'

/** Ejercicio del banco del API de backend. */
export type ApiExercise = {
  idExercise: number
  name: string
  description: string
  type: ApiExerciseType
  intensity: ApiIntensityLevel
  muscleGroups: ApiMuscleGroup[]
}

/** Bloque estructural del API de backend. */
export type ApiRoutineBlock = {
  kind: RoutineBlockKind
  title: string
  exercises: { idExercise: number; repetitions?: number; restSeconds?: number }[]
}

/** Mapeo inverso del tipo de ejercicio. */
export const typeToApi: Record<ExerciseType, ApiExerciseType> = {
  Fuerza: 'FUERZA',
  Cardio: 'CARDIO',
  Flexibilidad: 'FLEXIBILIDAD',
}

const typeFromApi: Record<ApiExerciseType, ExerciseType> = {
  FUERZA: 'Fuerza',
  CARDIO: 'Cardio',
  FLEXIBILIDAD: 'Flexibilidad',
}

/** Mapeo del nivel de intensidad a la forma del API de backend. */
export const intensityToApi: Record<IntensityLevel, ApiIntensityLevel> = {
  Bajo: 'BAJA',
  Medio: 'MEDIA',
  Alto: 'ALTA',
}

const intensityFromApi: Record<ApiIntensityLevel, IntensityLevel> = {
  BAJA: 'Bajo',
  MEDIA: 'Medio',
  ALTA: 'Alto',
}

export function mapMuscleGroup(group: ApiMuscleGroup): MuscleGroup {
  return { id: group.idGroup, name: group.name }
}

/** Convierte un ejercicio del API a la entidad del dominio. */
export function mapExercise(exercise: ApiExercise): Exercise {
  return {
    id: exercise.idExercise,
    name: exercise.name,
    description: exercise.description,
    type: typeFromApi[exercise.type],
    intensity: intensityFromApi[exercise.intensity],
    muscleGroups: exercise.muscleGroups.map(mapMuscleGroup),
  }
}
