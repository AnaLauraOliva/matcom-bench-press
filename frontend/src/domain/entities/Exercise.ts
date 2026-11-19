/** Tipos admitidos para clasificar un ejercicio en el banco. */
export type ExerciseType = 'Fuerza' | 'Cardio' | 'Flexibilidad'

/** Grupo muscular existente en el catálogo del sistema. */
export type MuscleGroup = {
  id: number
  name: string
}

/** Ejercicio registrado y sus clasificaciones, sin intensidad propia. */
export type Exercise = {
  id: number
  name: string
  description: string
  type: ExerciseType
  muscleGroups: MuscleGroup[]
}

/** Datos necesarios para registrar un ejercicio. */
export type CreateExerciseInput = {
  name: string
  description: string
  type: ExerciseType
  muscleGroupIds: number[]
}
