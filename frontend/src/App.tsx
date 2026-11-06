import LandingPage from './presentation/pages/LandingPage'
import AuthModal from './presentation/components/auth/AuthModal'
import { useAuth } from './presentation/hooks/useAuth'

// Repositorios concretos de infraestructura.
import { HttpAuthRepository } from './infrastructure/repositories/HttpAuthRepository'
import { HttpLocationRepository } from './infrastructure/repositories/HttpLocationRepository'

// Casos de uso de la aplicación.
import { Login } from './application/use-cases/auth/Login'
import { RegisterClient } from './application/use-cases/auth/RegisterClient'
import { GetLocations } from './application/use-cases/location/GetLocations'

// Creamos las dependencias una sola vez.
const authRepository = new HttpAuthRepository()
const locationRepository = new HttpLocationRepository()

const loginUseCase = new Login(authRepository)
const registerClientUseCase = new RegisterClient(authRepository)
const getLocationsUseCase = new GetLocations(locationRepository)

import './presentation/styles/global.css'
import './presentation/styles/layout.css'
import './presentation/styles/sections.css'
import './presentation/styles/auth.css'

function App() {
  const {
    authMode,
    form,
    message,
    isSubmitting,
    locations,
    isLoadingLocations,
    locationsError,
    handleFormChange,
    openAuth,
    closeAuth,
    handleSubmit,
  } = useAuth({
    loginUseCase,
    registerClientUseCase,
    getLocationsUseCase,
  })

  return (
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
          onClose={closeAuth}
          onSubmit={handleSubmit}
          onSwitchMode={() =>
            openAuth(authMode === 'register' ? 'login' : 'register')
          }
          onFormChange={handleFormChange}
        />
      )}
    </>
  )
}

export default App