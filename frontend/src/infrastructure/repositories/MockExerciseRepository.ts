import type { ExerciseRepository } from '../../application/ports/ExerciseRepository'
import type {
  CreateExerciseInput,
  Exercise,
  MuscleGroup,
} from '../../domain/entities/Exercise'

const muscleGroups: MuscleGroup[] = [
  { id: 1, name: 'Pecho' },
  { id: 2, name: 'Espalda' },
  { id: 3, name: 'Hombros' },
  { id: 4, name: 'Bíceps' },
  { id: 5, name: 'Tríceps' },
  { id: 6, name: 'Abdomen' },
  { id: 7, name: 'Cuádriceps' },
  { id: 8, name: 'Isquiotibiales' },
  { id: 9, name: 'Glúteos' },
  { id: 10, name: 'Pantorrillas' },
]

/** Repositorio en memoria para probar el flujo sin disponer del backend. */
export class MockExerciseRepository implements ExerciseRepository {
  private exercises: Exercise[] = [
    { id: 1, name: 'Sentadilla', description: 'Ejercicio de fuerza que consiste en flexionar las rodillas y las caderas para descender el cuerpo y volver a la posición inicial.' ,type: 'Fuerza', intensity: 'Bajo', muscleGroups: [muscleGroups[6], muscleGroups[8]] },
    { id: 2, name: 'Flexiones', description: 'Ejercicio de fuerza que trabaja principalmente el pecho, los hombros y los tríceps utilizando el peso corporal.' ,type: 'Fuerza', intensity: 'Medio', muscleGroups: [muscleGroups[0], muscleGroups[4], muscleGroups[2]] },
    { id: 3, name: 'Plancha', description: "Ejercicio isométrico que fortalece el abdomen y mejora la estabilidad del core.", type: 'Fuerza', intensity: 'Bajo', muscleGroups: [muscleGroups[5]] },
    { id: 4, name: 'Caminata rápida', description: "Actividad cardiovascular que mejora la resistencia física y favorece la salud del corazón.", type: 'Cardio', intensity: 'Alto', muscleGroups: [muscleGroups[6], muscleGroups[7], muscleGroups[8]] },
    { id: 5, name: 'Estiramiento de isquiotibiales', description: "Ejercicio de flexibilidad que ayuda a elongar los músculos posteriores del muslo y mejorar la movilidad.", type: 'Flexibilidad', intensity: 'Bajo', muscleGroups: [muscleGroups[7]] },
    { id: 6, name: 'Sentadilla con mancuerna', description: 'Ejercicio de fuerza que flexiona las rodillas y las caderas utilizando una mancuerna para mayor resistencia.', type: 'Fuerza', intensity: 'Medio', muscleGroups: [muscleGroups[6], muscleGroups[8]] },
    { id: 7, name: 'Dominadas', description: 'Ejercicio de fuerza que fortalece la espalda y los bíceps con el cuerpo y tirando del bar hasta la altura de los hombros.', type: 'Fuerza', intensity: 'Alto', muscleGroups: [muscleGroups[1], muscleGroups[3]] },
  ]

  async getAll(): Promise<Exercise[]> {
    return this.exercises.map((exercise) => ({
      ...exercise,
      muscleGroups: [...exercise.muscleGroups],
    }))
  }

  async getMuscleGroups(): Promise<MuscleGroup[]> {
    return muscleGroups.map((group) => ({ ...group }))
  }

  async create(input: CreateExerciseInput): Promise<Exercise> {
    const selectedGroups = muscleGroups.filter((group) =>
      input.muscleGroupIds.includes(group.id),
    )

    if (selectedGroups.length !== input.muscleGroupIds.length) {
      throw new Error('Uno o varios grupos musculares seleccionados no existen.')
    }

    const exercise: Exercise = {
      id: Math.max(0, ...this.exercises.map((item) => item.id)) + 1,
      name: input.name.trim(),
      description: input.description,
      type: input.type,
      intensity: 'Bajo',
      muscleGroups: selectedGroups,
    }

    this.exercises = [...this.exercises, exercise]
    return { ...exercise, muscleGroups: [...exercise.muscleGroups] }
  }
}
