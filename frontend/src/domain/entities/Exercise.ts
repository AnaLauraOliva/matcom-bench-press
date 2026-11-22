/** Tipos admitidos para clasificar un ejercicio en el banco. */
export type ExerciseType = 'Fuerza' | 'Cardio' | 'Flexibilidad'

/** Intensidad a asignar a un ejercicio. La persistencia en la base de datos está pendiente. */
export type IntensityLevel = 'Bajo' | 'Medio' | 'Alto'

/** Intensidades disponibles para ejercicios. */
export const INTENSITY_LEVELS: IntensityLevel[] = ['Bajo', 'Medio', 'Alto']

/** Grupo muscular existente en el catálogo del sistema. */
export type MuscleGroup = {
  id: number
  name: string
}

/** Ejercicio registrado y sus clasificaciones. */
export type Exercise = {
  id: number
  name: string
  description: string
  type: ExerciseType
  intensity: IntensityLevel
  muscleGroups: MuscleGroup[]
}

/** Datos necesarios para registrar un ejercicio. */
export type CreateExerciseInput = {
  name: string
  description: string
  type: ExerciseType
  intensity: IntensityLevel
  muscleGroupIds: number[]
}
