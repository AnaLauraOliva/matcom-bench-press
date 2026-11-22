import type { GenerateRoutineRequest, GeneratedRoutine } from '../../domain/entities/GeneratedRoutine'

/** Contrato de generación de rutinas a partir de parámetros de creación. */
export interface GenerateRoutinePort {
  generate(request: GenerateRoutineRequest): Promise<GeneratedRoutine>
}
