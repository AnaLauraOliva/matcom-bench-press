import type { TrainingProgram } from './TrainerDashboard'
import type { Exercise, ExerciseType, IntensityLevel } from './Exercise'

/** Tipo de bloque estructural que puede componer una rutina. */
export type RoutineBlockKind = 'CALIENTAMIENTO' | 'CIRCUITO' | 'SERIES' | 'DESCANSO'

/** Ejercicio dentro de un bloque de rutina. */
export type RoutineBlockExercise = {
  id: number
  repetitions?: number
  restSeconds?: number
}

/** Bloque estructural de una rutina: calentamiento, circuito, series o descanso. */
export type GeneratedRoutineBlock = {
  kind: RoutineBlockKind
  title: string
  exercises: RoutineBlockExercise[]
}

/** Rutina generada, lista para mostrar o conectar al backend. */
export type GeneratedRoutine = {
  name: string
  program: string
  exercises: Exercise[]
  blocks: GeneratedRoutineBlock[]
}

/** Parámetros que se envían al backend para que genere la rutina. */
export type GenerateRoutineRequest = {
  /** Programas de entrenamiento seleccionados; al menos uno. */
  programs: TrainingProgram[]
  /** Ejercicios del banco seleccionados, con la intensidad asignada a cada uno. */
  exercises: Exercise[]
  exerciseCount: number
  muscleGroupIds: number[]
  typeProportions: Record<ExerciseType, number>
  intensity: IntensityLevel
  /** Nombre elegido para la rutina; si está vacío el backend genera uno. */
  name: string
}
