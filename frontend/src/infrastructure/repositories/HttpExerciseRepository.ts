import apiClient from '../http/apiClient'
import type { ExerciseRepository } from '../../application/ports/ExerciseRepository'
import type {
  CreateExerciseInput,
  Exercise,
  MuscleGroup,
} from '../../domain/entities/Exercise'
import {
  intensityToApi,
  mapExercise,
  mapMuscleGroup,
  type ApiExercise,
  type ApiMuscleGroup,
  typeToApi
} from './httpMappers'

/**
 * Adaptador HTTP del banco de ejercicios.
 *
 * Contrato esperado del backend: GET /exercises devuelve { exercises },
 * GET /muscle-groups devuelve { muscleGroups } y POST /exercises recibe
 * { name, type, intensity, muscleGroupIds } y devuelve { exercise }.
 */
export class HttpExerciseRepository implements ExerciseRepository {
  async getAll(): Promise<Exercise[]> {
    const response = await apiClient.get<{ exercises: ApiExercise[] }>('/exercises')
    return response.data.exercises.map(mapExercise)
  }

  async getMuscleGroups(): Promise<MuscleGroup[]> {
    const response = await apiClient.get<{ muscleGroups: ApiMuscleGroup[] }>('/muscle-groups')
    return response.data.muscleGroups.map(mapMuscleGroup)
  }

  async create(input: CreateExerciseInput): Promise<Exercise> {
    const response = await apiClient.post<{ exercise: ApiExercise }>('/exercises', {
      name: input.name.trim(),
      description: input.description,
      type: typeToApi[input.type],
      intensity: intensityToApi['Bajo'],
      muscleGroupIds: input.muscleGroupIds,
    })

    return mapExercise(response.data.exercise)
  }
}
