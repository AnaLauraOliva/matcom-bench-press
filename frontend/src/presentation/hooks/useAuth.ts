
import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'

import type { Login } from '../../application/use-cases/auth/Login'
import type { RegisterClient } from '../../application/use-cases/auth/RegisterClient'
import type { GetLocations } from '../../application/use-cases/location/GetLocations'

import type { AuthForm, AuthMode } from '../types/auth'
import type { Location } from '../../domain/entities/location'

const INITIAL_FORM: AuthForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  age: '',
  sex: '',
  idLocation: '',
}

type UseAuthDependencies = {
  loginUseCase: Login
  registerClientUseCase: RegisterClient
  getLocationsUseCase: GetLocations
}

export function useAuth({
  loginUseCase,
  registerClientUseCase,
  getLocationsUseCase,
}: UseAuthDependencies) {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const [form, setForm] = useState<AuthForm>({ ...INITIAL_FORM })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  }

  function closeAuth() {
    setAuthMode(null)
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (authMode === 'register' && !form.sex) {
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
        const result = await loginUseCase.execute({
          email: form.email.trim(),
          password: form.password,
        })

        // TODO: integrar el token y los datos del usuario.
        console.log('Usuario autenticado:', result.user)

        setMessage('Inicio de sesión correcto.')
      } else if (authMode === 'register') {
        await registerClientUseCase.execute({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: 'CLIENT',
          age: Number(form.age),
          sex: form.sex as 'FEMENINO' | 'MASCULINO' | 'OTRO',
          idLocation: Number(form.idLocation),
        })

        setMessage('Registro completado correctamente.')
      }
    } catch (error: unknown) {
      if (
        axios.isAxiosError<{
          error?: { code?: string; message?: string }
        }>(error)
      ) {
        setMessage(
          error.response?.data?.error?.message ??
            'No se pudo completar la operación. Comprueba los datos y la conexión con el servidor.',
        )
      } else {
        setMessage('Ocurrió un error inesperado.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
