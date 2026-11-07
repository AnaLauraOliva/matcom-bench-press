import { BrowserRouter, useNavigate } from 'react-router'

import LandingPage from './presentation/pages/LandingPage'
import AuthModal from './presentation/components/auth/AuthModal'

import { useAuth } from './presentation/hooks/useAuth'
import { AuthSessionProvider } from './presentation/contexts/AuthSessionContext'
import { useAuthSession } from './presentation/contexts/useAuthSession'

import AppRouter from './presentation/routes/AppRouter'
import { getRolePath } from './presentation/routes/rolePaths'

// Repositorios concretos de infraestructura.
import { HttpAuthRepository } from './infrastructure/repositories/HttpAuthRepository'
import { HttpLocationRepository } from './infrastructure/repositories/HttpLocationRepository'
import { LocalStorageSessionRepository } from './infrastructure/repositories/LocalStorageSessionRepository'

// Casos de uso de la aplicación.
import { Login } from './application/use-cases/auth/Login'
import { RegisterClient } from './application/use-cases/auth/RegisterClient'
import { GetLocations } from './application/use-cases/location/GetLocations'

// Creamos las dependencias una sola vez.
const authRepository = new HttpAuthRepository()
const locationRepository = new HttpLocationRepository()
const sessionRepository = new LocalStorageSessionRepository()

const loginUseCase = new Login(authRepository)
const registerClientUseCase = new RegisterClient(authRepository)
const getLocationsUseCase = new GetLocations(locationRepository)

// Estilos globales.
import './presentation/styles/global.css'
import './presentation/styles/layout.css'
import './presentation/styles/sections.css'
import './presentation/styles/auth.css'

/**
 * Contiene la interfaz y la lógica de autenticación.
 * Se renderiza dentro de BrowserRouter y AuthSessionProvider.
 */
function AppContent() {
  const navigate = useNavigate()
  const { setSession } = useAuthSession()

  // Gestiona el formulario de login y registro.
  const {
    authMode,
    form,
    message,
    isSubmitting,
    registrationCompleted,
    locations,
    isLoadingLocations,
    locationsError,
    handleFormChange,
    openAuth,
    closeAuth,
    handleSubmit,
    handleGoToPanel,
  } = useAuth({
    loginUseCase,
    registerClientUseCase,
    getLocationsUseCase,

    // Guarda la sesión y redirige según el rol.
    onLoginSuccess: (session) => {
      setSession(session)
      console.log('Usuario autenticado:', session.user)
      console.log('Rol recibido:', session.user.role)
      navigate(getRolePath(session.user.role), {
        replace: true,
      })
    },
  })

  return (
    <AppRouter
      homePage={
        <>
          <LandingPage onOpenAuth={openAuth} />

          {authMode && (
            <AuthModal
              mode={authMode}
              form={form}
              locations={locations}
              isLoadingLocations={isLoadingLocations}
              locationsError={locationsError}
              message={message}
              isSubmitting={isSubmitting}
              registrationCompleted={registrationCompleted}
              onClose={closeAuth}
              onSubmit={handleSubmit}
              onGoToPanel={handleGoToPanel}
              onContinueLater={closeAuth}
              onSwitchMode={() =>
                openAuth(authMode === 'register' ? 'login' : 'register')
              }
              onFormChange={handleFormChange}
            />
          )}
        </>
      }
    />
  )
}

/**
 * Componente raíz de la aplicación.
 * Proporciona el enrutador y el contexto de autenticación.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthSessionProvider sessionRepository={sessionRepository}>
        <AppContent />
      </AuthSessionProvider>
    </BrowserRouter>
  )
}

export default App