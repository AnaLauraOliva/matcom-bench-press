import apiClient from '../http/apiClient'
import type { GenerateRoutinePort } from '../../application/ports/GenerateRoutinePort'
import type {
  GenerateRoutineRequest,
  GeneratedRoutine,
} from '../../domain/entities/GeneratedRoutine'
import { intensityToApi, mapExercise, type ApiExercise, type ApiRoutineBlock } from './httpMappers'

/** Rutina generada como la devuelve el API de backend. */
type ApiGeneratedRoutine = {
  name: string
  program: string
  exercises: ApiExercise[]
  blocks: ApiRoutineBlock[]
}

/**
 * Adaptador HTTP de la generación de rutinas.
 *
 * Contrato esperado del backend: POST /routines recibe
 * { programIds, exercises: [{idExercise, intensity}], exerciseCount,
 *   muscleGroupIds, typeProportions: {FUERZA, CARDIO, FLEXIBILIDAD}, intensity }
 * y devuelve { routine: { name, program, exercises: ApiExercise[],
 *   blocks: [{ kind, title, exercises: [{idExercise, repetitions?, restSeconds?}] }] } }.
 */
export class HttpGenerateRoutine implements GenerateRoutinePort {
  async generate(request: GenerateRoutineRequest): Promise<GeneratedRoutine> {
    const response = await apiClient.post<{ routine: ApiGeneratedRoutine }>('/routines', {
      programIds: request.programs.map((program) => program.id),
      exercises: request.exercises.map((exercise) => ({
        idExercise: exercise.id,
        intensity: intensityToApi[exercise.intensity],
      })),
      exerciseCount: request.exerciseCount,
      muscleGroupIds: request.muscleGroupIds,
      typeProportions: {
        FUERZA: request.typeProportions.Fuerza,
        CARDIO: request.typeProportions.Cardio,
        FLEXIBILIDAD: request.typeProportions.Flexibilidad,
      },
      intensity: intensityToApi[request.intensity],
      name: request.name,
    })

    const { routine } = response.data

    return {
      ...routine,
      exercises: routine.exercises.map(mapExercise),
      blocks: routine.blocks.map((block) => ({
        kind: block.kind,
        title: block.title,
        exercises: block.exercises.map((exercise) => ({
          id: exercise.idExercise,
          repetitions: exercise.repetitions,
          restSeconds: exercise.restSeconds,
        })),
      })),
    }
  }
}
