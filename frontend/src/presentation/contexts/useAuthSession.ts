import { createContext, useContext } from 'react'

import type { AuthSession } from '../../application/dtos/auth'

/**
 * Define las operaciones disponibles para gestionar la sesión.
 */
export type AuthSessionContextType = {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  logout: () => void
}

/**
 * Contexto compartido de autenticación.
 */
export const AuthSessionContext =
  createContext<AuthSessionContextType | null>(null)

/**
 * Permite acceder al contexto de autenticación.
 */
export function useAuthSession(): AuthSessionContextType {
  const context = useContext(AuthSessionContext)

  if (!context) {
    throw new Error(
      'useAuthSession debe utilizarse dentro de AuthSessionProvider.',
    )
  }

  return context
}