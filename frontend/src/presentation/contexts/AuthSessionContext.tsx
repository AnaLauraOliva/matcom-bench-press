import { useState, type ReactNode } from 'react'

import type { AuthSession } from '../../application/dtos/auth'
import type { SessionRepository } from '../../application/ports/SessionRepository'

import {
  AuthSessionContext,
} from './useAuthSession'

type AuthSessionProviderProps = {
  children: ReactNode
  sessionRepository: SessionRepository
}

/**
 * Proporciona el estado de autenticación a toda la aplicación.
 */
export function AuthSessionProvider({
  children,
  sessionRepository,
}: AuthSessionProviderProps) {
  // Recuperamos la sesión al iniciar la aplicación.
  const [session, setCurrentSession] = useState<AuthSession | null>(
    () => sessionRepository.getSession(),
  )

  /**
   * Actualiza el estado y persiste la sesión.
   */
  function setSession(newSession: AuthSession) {
    sessionRepository.saveSession(newSession)
    setCurrentSession(newSession)
  }

  /**
   * Cierra la sesión y elimina los datos almacenados.
   */
  function logout() {
    sessionRepository.clearSession()
    setCurrentSession(null)
  }

  return (
    <AuthSessionContext.Provider value={{ session, setSession, logout }}>
      {children}
    </AuthSessionContext.Provider>
  )
}