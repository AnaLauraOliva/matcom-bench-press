import { Navigate, Outlet } from 'react-router'

import type { UserRole } from '../../../application/dtos/auth'
import { useAuthSession } from '../../contexts/useAuthSession'

import { APP_PATHS } from '../../routes/paths'
import { getRolePath } from '../../routes/rolePaths'

type ProtectedRouteProps = {
  allowedRoles: UserRole[]
}

/**
 * Protege las rutas según la sesión y los roles autorizados.
 */
function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session } = useAuthSession()

  // Si no existe sesión, enviamos al inicio.
  if (!session) {
    return <Navigate to={APP_PATHS.HOME} replace />
  }

  // Si el rol no está autorizado, redirigimos a su panel.
  if (!allowedRoles.includes(session.user.role)) {
    return (
      <Navigate
        to={getRolePath(session.user.role)}
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute