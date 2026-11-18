import type { TrainerDashboardRepository } from '../../ports/TrainerDashboardRepository'
import type { TrainerDashboard } from '../../../domain/entities/TrainerDashboard'

/**
 * Obtiene la información necesaria para mostrar el panel del entrenador.
 */
export class GetTrainerDashboard {
  private readonly trainerDashboardRepository: TrainerDashboardRepository

  constructor(trainerDashboardRepository: TrainerDashboardRepository) {
    this.trainerDashboardRepository = trainerDashboardRepository
  }

  /**
   * Ejecuta la consulta del panel.
   *
   * @returns Resumen, rutinas y ejercicios disponibles para la vista.
   */
  execute(): Promise<TrainerDashboard> {
    return this.trainerDashboardRepository.getDashboard()
  }
}