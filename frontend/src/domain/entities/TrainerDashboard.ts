/**
 * Información resumida que necesita el panel principal del entrenador.
 * Los datos son independientes de la tecnología utilizada para obtenerlos.
 */
export type TrainerDashboardSummary = {
  pendingClients: number
  activeClients: number
  createdRoutines: number
  registeredExercises: number
}

/** Representa un ejercicio disponible en el banco de ejercicios. */
export type Exercise = {
  id: number
  name: string
  muscleGroup: string
  type: 'Fuerza' | 'Cardio' | 'Flexibilidad'
  intensity: 'Baja' | 'Media' | 'Alta'
}

/** Representa una rutina que puede consultarse desde el panel. */
export type TrainingRoutine = {
  id: number
  name: string
  program: string
  author: string
  status: 'Borrador' | 'Pendiente de validación' | 'Aprobada'
  updatedAt: string
}

/** Datos necesarios para construir el resumen del panel del entrenador. */
export type TrainerDashboard = {
  summary: TrainerDashboardSummary
  recentRoutines: TrainingRoutine[]
  exercises: Exercise[]
  routinesToReview: TrainingRoutine[]
}
