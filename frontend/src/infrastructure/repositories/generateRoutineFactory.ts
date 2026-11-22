import type { GenerateRoutinePort } from '../../application/ports/GenerateRoutinePort'
import { HttpGenerateRoutine } from './HttpGenerateRoutine'
import { MockGenerateRoutine } from './MockGenerateRoutine'

/** Selecciona el adaptador de generación según la configuración de entorno. */
export function createGenerateRoutinePort(): GenerateRoutinePort {
  return import.meta.env.VITE_USE_MOCK === 'false'
    ? new HttpGenerateRoutine()
    : new MockGenerateRoutine()
}
