import type {
  CreateExerciseInput,
  Exercise,
  MuscleGroup,
} from '../../domain/entities/Exercise'

/** Contrato de acceso al banco de ejercicios y al catálogo muscular. */
export interface ExerciseRepository {
  getAll(): Promise<Exercise[]>
  getMuscleGroups(): Promise<MuscleGroup[]>
  create(input: CreateExerciseInput): Promise<Exercise>
}