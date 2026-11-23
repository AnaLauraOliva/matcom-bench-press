import type { TrainerDashboard } from '../../domain/entities/TrainerDashboard'

/**
 * Puerto de acceso a los datos del panel del entrenador.
 *
 * La capa de presentación depende de esta abstracción y no de una API
 * concreta ni de una implementación de persistencia.
 */
export interface TrainerDashboardRepository {
  getDashboard(): Promise<TrainerDashboard>
}
