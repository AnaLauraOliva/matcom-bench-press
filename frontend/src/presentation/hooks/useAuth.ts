import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'

import type { Login } from '../../application/use-cases/auth/Login'
import type { RegisterClient } from '../../application/use-cases/auth/RegisterClient'
import type { GetLocations } from '../../application/use-cases/location/GetLocations'

import type { AuthForm, AuthMode } from '../types/auth'
import type { Location } from '../../domain/entities/Location'

import type { AuthSession } from '../../application/dtos/auth'

const INITIAL_FORM: AuthForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  age: '',
  gender: '',
  idLocation: '',
}

type UseAuthDependencies = {
  loginUseCase: Login
  registerClientUseCase: RegisterClient
  getLocationsUseCase: GetLocations
  onLoginSuccess: (session: AuthSession) => void
}

export function useAuth({
  loginUseCase,
  registerClientUseCase,
  getLocationsUseCase,
  onLoginSuccess,
}: UseAuthDependencies) {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const [form, setForm] = useState<AuthForm>({ ...INITIAL_FORM })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationCompleted, setRegistrationCompleted] = useState(false)

  const [locations, setLocations] = useState<Location[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)
  const [locationsError, setLocationsError] = useState('')

  useEffect(() => {
    async function loadLocations() {
      try {
        setIsLoadingLocations(true)
        const data = await getLocationsUseCase.execute()
        setLocations(data)
      } catch (error) {
        console.error('Error al cargar las sedes:', error)
        setLocationsError(
          'No se pudieron cargar las sedes. Recarga la página.',
        )
      } finally {
        setIsLoadingLocations(false)
      }
    }

    loadLocations()
  }, [getLocationsUseCase])

  function handleFormChange(field: keyof AuthForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function openAuth(mode: AuthMode) {
    setAuthMode(mode)
    setForm({ ...INITIAL_FORM })
    setMessage('')
    setRegistrationCompleted(false)
  }

  function closeAuth() {
    setAuthMode(null)
    setMessage('')
    setRegistrationCompleted(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (authMode === 'register' && !form.gender) {
      setMessage('Selecciona una opción de género.')
      return
    }

    if (authMode === 'register' && !form.idLocation) {
      setMessage('Selecciona una sede del gimnasio.')
      return
    }

    setIsSubmitting(true)

    try {
      if (authMode === 'login') {
        const session = await loginUseCase.execute({
          email: form.email.trim(),
          password: form.password,
        })

        onLoginSuccess(session)
        closeAuth()
      } else if (authMode === 'register') {
        await registerClientUseCase.execute({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: 'CLIENT',
          age: Number(form.age),
          gender: form.gender as 'FEMENINO' | 'MASCULINO' | 'OTRO',
          idLocation: Number(form.idLocation),
        })

        setRegistrationCompleted(true)
      }
    } catch (error: unknown) {
      console.error('Error durante la autenticación:', error)

      if (axios.isAxiosError(error)) {
        console.error('Respuesta del servidor:', error.response?.data)
        console.error('Código HTTP:', error.response?.status)

        setMessage(
          error.response?.data?.error?.message ??
            'No se pudo completar la operación.',
        )
      } else if (error instanceof Error) {
        console.error('Mensaje:', error.message)
        setMessage(error.message)
      } else {
        setMessage('Ocurrió un error inesperado.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Inicia sesión después de que el usuario elija ir a su panel.
  async function handleGoToPanel() {
    setIsSubmitting(true)
    setMessage('')

    try {
      const session = await loginUseCase.execute({
        email: form.email.trim(),
        password: form.password,
      })

      onLoginSuccess(session)
      closeAuth()
    } catch (error) {
      console.error('Error al iniciar sesión automáticamente:', error)

      setMessage(
        'Tu cuenta fue creada, pero no pudimos iniciar sesión automáticamente. Inténtalo desde el inicio de sesión.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}