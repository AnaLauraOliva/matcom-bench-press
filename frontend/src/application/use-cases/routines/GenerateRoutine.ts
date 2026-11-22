import type { GenerateRoutineRequest, GeneratedRoutine } from '../../../domain/entities/GeneratedRoutine'
import type { GenerateRoutinePort } from '../../ports/GenerateRoutinePort'

/** Genera una rutina a partir de los parámetros de creación. */
export class GenerateRoutine {
  constructor(private readonly port: GenerateRoutinePort) {}

  execute(request: GenerateRoutineRequest): Promise<GeneratedRoutine> {
    return this.port.generate(request)
  }
}
