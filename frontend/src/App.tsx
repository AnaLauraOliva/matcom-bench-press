import LandingPage from './pages/LandingPage'
import AuthModal from './components/auth/AuthModal'
import { useAuth } from './hooks/useAuth'

import './styles/global.css'
import './styles/layout.css'
import './styles/sections.css'
import './styles/auth.css'

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
  } = useAuth()

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