import {
  Navigate,
  Route,
  Routes,
} from 'react-router'

import AdminPage from '../pages/AdminPage'
import TrainerPage from '../pages/TrainerPage'
import ClientPage from '../pages/ClientPage'

import ProtectedRoute from '../components/routing/ProtectedRoute'
import { APP_PATHS } from './paths'

import type { ReactNode } from 'react'

type AppRouterProps = {
  homePage: ReactNode
}

/**
 * Define las rutas públicas y protegidas de la aplicación.
 */
function AppRouter({ homePage }: AppRouterProps) {
  return (
      <Routes>
        {/* Página pública. */}
        <Route path={APP_PATHS.HOME} element={homePage} />

        {/* Rutas exclusivas del administrador. */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path={APP_PATHS.ADMIN} element={<AdminPage />} />
        </Route>

        {/* Entrenadores y jefes de sala comparten página. */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={['TRAINER', 'HEAD_TRAINER']}
            />
          }
        >
          <Route path={APP_PATHS.TRAINER} element={<TrainerPage />} />
        </Route>

        {/* Ruta exclusiva del cliente. */}
        <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
          <Route path={APP_PATHS.CLIENT} element={<ClientPage />} />
        </Route>

        {/* Cualquier ruta desconocida vuelve al inicio. */}
        <Route
          path="*"
          element={<Navigate to={APP_PATHS.HOME} replace />}
        />
      </Routes>
  )
}

export default AppRouter