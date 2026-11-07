import type { AuthSession } from '../dtos/auth'

/**
 * Define las operaciones necesarias para gestionar una sesión.
 */
export interface SessionRepository {
  getSession(): AuthSession | null

  saveSession(session: AuthSession): void

  clearSession(): void
}