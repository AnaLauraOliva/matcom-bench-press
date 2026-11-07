import type { UserRole } from '../../application/dtos/auth'
import { APP_PATHS } from './paths'

/**
 * Obtiene la ruta correspondiente a cada rol.
 */
export function getRolePath(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return APP_PATHS.ADMIN

    case 'TRAINER':
    case 'HEAD_TRAINER':
      return APP_PATHS.TRAINER

    case 'CLIENT':
      return APP_PATHS.CLIENT
  }
}