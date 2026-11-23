import type { TrainerDashboardRepository } from '../../application/ports/TrainerDashboardRepository'
import type { TrainerDashboard } from '../../domain/entities/TrainerDashboard'

/**
 * Proporciona datos de demostración para desarrollar la interfaz del
 * entrenador mientras se implementan los endpoints correspondientes.
 *
 * Esta implementación debe sustituirse por un adaptador HTTP cuando el
 * backend exponga los servicios del panel.
 */
export class MockTrainerDashboardRepository
  implements TrainerDashboardRepository
{
  /**
   * Devuelve información ficticia para previsualizar los componentes.
   */
  async getDashboard(): Promise<TrainerDashboard> {
    return {
      summary: {
        pendingClients: 4,
        activeClients: 18,
        createdRoutines: 12,
        registeredExercises: 36,
      },
      programs: [
        { id: 1, name: 'Acondicionamiento físico', active: true, objetive: 'Mejorar la capacidad aeróbica', desciption: '' },
        { id: 2, name: 'Bienestar integral', active: true, objetive: 'Salud general y movilidad', desciption: '' },
        { id: 3, name: 'Preparación deportiva', active: true, objetive: 'Preparación específica para el rendimiento', desciption: '' },
      ],
      recentRoutines: [
        {
          id: 1,
          name: 'Fuerza · Tren superior',
          program: 'Acondicionamiento físico',
          author: 'Tú',
          status: 'Pendiente de validación',
          updatedAt: 'Hoy',
        },
        {
          id: 2,
          name: 'Movilidad y flexibilidad',
          program: 'Bienestar integral',
          author: 'María González',
          status: 'Aprobada',
          updatedAt: 'Ayer',
        },
        {
          id: 3,
          name: 'Resistencia cardiovascular',
          program: 'Acondicionamiento físico',
          author: 'Tú',
          status: 'Borrador',
          updatedAt: '12 nov. 2026',
        },
      ],
      exercises: [
        { id: 1, name: 'Sentadilla', description: 'Ejercicio de fuerza que consiste en flexionar las rodillas y las caderas para descender el cuerpo y volver a la posición inicial.' , type: 'Fuerza', intensity: 'Bajo', muscleGroups: [{ id: 7, name: 'Cuádriceps' }, { id: 9, name: 'Glúteos' }] },
        { id: 2, name: 'Flexiones', description: 'Ejercicio de fuerza que trabaja principalmente el pecho, los hombros y los tríceps utilizando el peso corporal.', type: 'Fuerza', intensity: 'Medio', muscleGroups: [{ id: 1, name: 'Pecho' }, { id: 5, name: 'Tríceps' }, { id: 3, name: 'Hombros' }] },
        { id: 3, name: 'Plancha', description: "Ejercicio isométrico que fortalece el abdomen y mejora la estabilidad del core.", type: 'Fuerza', intensity: 'Bajo', muscleGroups: [{ id: 6, name: 'Abdomen' }] },
        { id: 4, name: 'Caminata rápida', description: "Actividad cardiovascular que mejora la resistencia física y favorece la salud del corazón.", type: 'Cardio', intensity: 'Alto', muscleGroups: [{ id: 7, name: 'Cuádriceps' }, { id: 8, name: 'Isquiotibiales' }] },
        { id: 5, name: 'Estiramiento de isquiotibiales', description: "Ejercicio de flexibilidad que ayuda a elongar los músculos posteriores del muslo y mejorar la movilidad.", type: 'Flexibilidad', intensity: 'Bajo', muscleGroups: [{ id: 8, name: 'Isquiotibiales' }] },
      ],
      routinesToReview: [
        {
          id: 4,
          name: 'Fuerza · Tren inferior',
          program: 'Acondicionamiento físico',
          author: 'Carlos Pérez',
          status: 'Pendiente de validación',
          updatedAt: 'Hoy',
        },
        {
          id: 5,
          name: 'Resistencia inicial',
          program: 'Bienestar integral',
          author: 'Ana Rodríguez',
          status: 'Pendiente de validación',
          updatedAt: 'Ayer',
        },
      ],
    }
  }
}
