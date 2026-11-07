import type { SessionRepository } from '../../application/ports/SessionRepository'
import type { AuthSession } from '../../application/dtos/auth'

// Clave única utilizada para guardar la sesión.
export const AUTH_SESSION_KEY = 'matcom_auth_session'

/**
 * Implementa la persistencia de la sesión utilizando localStorage.
 */
export class LocalStorageSessionRepository implements SessionRepository {
  /**
   * Recupera la sesión almacenada.
   * Si no existe o está dañada, devuelve null.
   */
  getSession(): AuthSession | null {
    try {
      const storedSession = localStorage.getItem(AUTH_SESSION_KEY)

      if (!storedSession) {
        return null
      }

      return JSON.parse(storedSession) as AuthSession
    } catch (error) {
      console.error('No se pudo recuperar la sesión:', error)

      this.clearSession()
      return null
    }
  }

  /**
   * Guarda el token y los datos del usuario.
   */
  saveSession(session: AuthSession): void {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
  }

  /**
   * Elimina la sesión almacenada.
   */
  clearSession(): void {
    localStorage.removeItem(AUTH_SESSION_KEY)
  }
}