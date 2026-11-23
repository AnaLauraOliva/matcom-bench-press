import type { GenerateRoutineRequest, GeneratedRoutine } from '../../../domain/entities/GeneratedRoutine'
import type { GenerateRoutinePort } from '../../ports/GenerateRoutinePort'

/** Genera una rutina a partir de los parámetros de creación. */
export class GenerateRoutine {
  private readonly port: GenerateRoutinePort

  constructor(port: GenerateRoutinePort) {
    this.port = port
  }

  execute(request: GenerateRoutineRequest): Promise<GeneratedRoutine> {
    return this.port.generate(request)
  }
}
