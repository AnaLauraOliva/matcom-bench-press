import type { GenerateRoutinePort } from '../../application/ports/GenerateRoutinePort'
import type {
  GenerateRoutineRequest,
  GeneratedRoutine,
  GeneratedRoutineBlock,
} from '../../domain/entities/GeneratedRoutine'
import type { Exercise, ExerciseType, IntensityLevel } from '../../domain/entities/Exercise'

/** Títulos de los bloques del mock. */
const BLOCK_TITLES: Record<GeneratedRoutineBlock['kind'], string> = {
  CALIENTAMIENTO: 'Calentamiento',
  CIRCUITO: 'Circuitos',
  SERIES: 'Series',
  DESCANSO: 'Descanso',
}

/** Repeticiones sugeridas por intensidad en el mock. */
const REPETITIONS: Record<IntensityLevel, number> = {
  Bajo: 14,
  Medio: 10,
  Alto: 6,
}

const EXERCISE_TYPES: ExerciseType[] = ['Fuerza', 'Cardio', 'Flexibilidad']

/**
 * Genera una rutina en memoria a partir de los parámetros de creación.
 *
 * El mock distribuye los ejercicios seleccionados respetando la proporción
 * de ejercicios por tipo y devuelve la estructura estándar de bloques:
 * calentamiento, circuitos, series y descansos.
 */
export class MockGenerateRoutine implements GenerateRoutinePort {
  async generate(request: GenerateRoutineRequest): Promise<GeneratedRoutine> {
    const selected: Exercise[] = []
    const add = (exercise: Exercise) => {
      if (!selected.some((item) => item.id === exercise.id)) {
        selected.push(exercise)
      }
    }

    const count = Math.max(1, Math.min(request.exerciseCount, request.exercises.length))
    const proportions = this.normalizeProportions(request.typeProportions)

    // Distribuye la cantidad total respetando la proporción por tipo.
    for (const type of EXERCISE_TYPES) {
      const share = Math.round(count * proportions[type])
      for (const exercise of request.exercises.filter((item) => item.type === type)) {
        if (selected.length >= share) break
        add(exercise)
      }
    }

    // Completa con ejercicios restantes si las proporciones quedaron vacías.
    for (const exercise of request.exercises) {
      if (selected.length >= count) break
      add(exercise)
    }

    const names = request.programs.map((program) => program.name)
    const requestedName = request.name?.trim()

    return {
      name: requestedName || (names.length > 0 ? `Rutina · ${names.join(', ')}` : 'Rutina generada'),
      program: names.join(', '),
      exercises: selected,
      blocks: this.buildBlocks(selected),
    }
  }

  /** Normaliza las proporciones de tipo para sumar 1. */
  private normalizeProportions(input: Record<ExerciseType, number>): Record<ExerciseType, number> {
    const total = EXERCISE_TYPES.reduce((sum, type) => sum + (input[type] ?? 0), 0)
    const base: Record<ExerciseType, number> =
      total > 0 ? input : { Fuerza: 40, Cardio: 30, Flexibilidad: 30 }
    const baseTotal = EXERCISE_TYPES.reduce((sum, type) => sum + base[type], 0)

    return {
      Fuerza: base.Fuerza / baseTotal,
      Cardio: base.Cardio / baseTotal,
      Flexibilidad: base.Flexibilidad / baseTotal,
    }
  }

  /** Arma la estructura de bloques: calentamiento, circuitos, series y descanso final. */
  private buildBlocks(selected: Exercise[]): GeneratedRoutineBlock[] {
    const warmup = selected.slice(0, 2)
    const main = selected.slice(warmup.length)
    const blocks: GeneratedRoutineBlock[] = []

    if (warmup.length > 0) {
      blocks.push({
        kind: 'CALIENTAMIENTO',
        title: BLOCK_TITLES.CALIENTAMIENTO,
        exercises: warmup.map((exercise) => ({ id: exercise.id, repetitions: 10 })),
      })
    }

    if (main.length > 0) {
      blocks.push({
        kind: 'CIRCUITO',
        title: BLOCK_TITLES.CIRCUITO,
        exercises: main.map((exercise) => ({
          id: exercise.id,
          repetitions: REPETITIONS[exercise.intensity],
        })),
      })
    }

    blocks.push({ kind: 'DESCANSO', title: BLOCK_TITLES.DESCANSO, exercises: [] })

    return blocks
  }
}
