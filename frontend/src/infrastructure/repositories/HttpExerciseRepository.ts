import apiClient from '../http/apiClient'
import type { ExerciseRepository } from '../../application/ports/ExerciseRepository'
import type {
  CreateExerciseInput,
  Exercise,
  ExerciseType,
  MuscleGroup,
} from '../../domain/entities/Exercise'

type ApiExerciseType = 'FUERZA' | 'CARDIO' | 'FLEXIBILIDAD'

type ApiMuscleGroup = {
  idGroup: number
  name: string
}

type ApiExercise = {
  idExercise: number
  name: string
  description: string
  type: ApiExerciseType
  muscleGroups: ApiMuscleGroup[]
}

const typeToApi: Record<ExerciseType, ApiExerciseType> = {
  Fuerza: 'FUERZA',
  Cardio: 'CARDIO',
  Flexibilidad: 'FLEXIBILIDAD',
}

const typeFromApi: Record<ApiExerciseType, ExerciseType> = {
  FUERZA: 'Fuerza',
  CARDIO: 'Cardio',
  FLEXIBILIDAD: 'Flexibilidad',
}

function mapMuscleGroup(group: ApiMuscleGroup): MuscleGroup {
  return { id: group.idGroup, name: group.name }
}

function mapExercise(exercise: ApiExercise): Exercise {
  return {
    id: exercise.idExercise,
    name: exercise.name,
    description: exercise.description,
    type: typeFromApi[exercise.type],
    muscleGroups: exercise.muscleGroups.map(mapMuscleGroup),
  }
}

/**
 * Adaptador HTTP del banco de ejercicios.
 *
 * Contrato esperado del backend: GET /exercises devuelve { exercises },
 * GET /muscle-groups devuelve { muscleGroups } y POST /exercises recibe
 * { name, type, muscleGroupIds } y devuelve { exercise }.
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
      muscleGroupIds: input.muscleGroupIds,
    })

    return mapExercise(response.data.exercise)
  }
}
