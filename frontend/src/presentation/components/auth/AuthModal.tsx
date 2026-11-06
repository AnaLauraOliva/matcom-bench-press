import { ArrowRight, Dumbbell, X } from 'lucide-react'
import type { FormEvent } from 'react'
import CustomSelect from '../common/CustomSelect'
import AgeInput from '../common/AgeInput'
import type { Location } from '../../../domain/entities/Location'
import type { AuthForm, AuthMode } from '../../types/auth'

type AuthModalProps = {
  mode: AuthMode
  form: AuthForm
  locations: Location[]
  isLoadingLocations: boolean
  locationsError: string
  message: string
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSwitchMode: () => void
  onFormChange: (field: keyof AuthForm, value: string) => void
}

function AuthModal({
  mode,
  form,
  locations,
  isLoadingLocations,
  locationsError,
  message,
  isSubmitting,
  onClose,
  onSubmit,
  onSwitchMode,
  onFormChange,
}: AuthModalProps) {
  const isRegister = mode === 'register'

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Cerrar formulario"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <span className="auth-logo">
          <Dumbbell size={25} />
        </span>

        <span className="section-label">
          {isRegister ? 'ÚNETE A MATCOM BENCH PRESS' : '¡QUÉ BUENO VERTE!'}
        </span>

        <h2 id="auth-title">
          {isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}
        </h2>

        <p className="auth-subtitle">
          {isRegister
            ? 'Prepara el camino para tu próximo objetivo.'
            : 'Accede a tu espacio de entrenamiento.'}
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          {isRegister && (
            <>
              <label>
                Nombre completo
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    onFormChange('name', event.target.value)
                  }
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Teléfono
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(event) =>
                    onFormChange(
                      'phone',
                      event.target.value.replace(/\D/g, ''),
                    )
                  }
                  maxLength={30}
                  pattern="[0-9]+"
                  title="Introduce el teléfono usando solo números."
                  required
                />
              </label>

              <label>
                Edad
                <AgeInput
                  value={form.age}
                  onChange={(value) => onFormChange('age', value)}
                />
              </label>

              <label>
                Género
                <CustomSelect
                  value={form.sex}
                  placeholder="Selecciona una opción"
                  options={[
                    { value: 'FEMENINO', label: 'Femenino' },
                    { value: 'MASCULINO', label: 'Masculino' },
                    { value: 'OTRO', label: 'Otro' },
                  ]}
                  onChange={(value) => onFormChange('sex', value)}
                />
              </label>

              <label>
                Sede del gimnasio
                <CustomSelect
                  value={form.idLocation}
                  placeholder={
                    isLoadingLocations
                      ? 'Cargando sedes...'
                      : locationsError
                        ? 'Sedes no disponibles'
                        : 'Selecciona una sede'
                  }
                  options={locations.map((location) => ({
                    value: String(location.idLocation),
                    label: location.name,
                  }))}
                  disabled={
                    isLoadingLocations ||
                    locations.length === 0 ||
                    Boolean(locationsError)
                  }
                  onChange={(value) => onFormChange('idLocation', value)}
                />

                {locationsError && (
                  <p className="form-message" role="alert">
                    {locationsError}
                  </p>
                )}
              </label>
            </>
          )}

          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={form.email}
              onChange={(event) =>
                onFormChange('email', event.target.value)
              }
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={(event) =>
                onFormChange('password', event.target.value)
              }
              minLength={isRegister ? 8 : undefined}
              maxLength={isRegister ? 72 : undefined}
              pattern={
                isRegister
                  ? '(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,72}'
                  : undefined
              }
              title={
                isRegister
                  ? 'Debe tener entre 8 y 72 caracteres, incluyendo una letra, un número y un símbolo.'
                  : undefined
              }
              required
            />
          </label>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          <button
            className="button button-primary auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Procesando...'
              : isRegister
                ? 'Crear cuenta'
                : 'Iniciar sesión'}

            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister
            ? '¿Ya tienes una cuenta?'
            : '¿Todavía no tienes una cuenta?'}{' '}
          <button type="button" onClick={onSwitchMode}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </section>
    </div>
  )
}

export default AuthModal