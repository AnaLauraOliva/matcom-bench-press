
import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'

import { login, register } from '../api/auth'
import { getLocations } from '../api/locations'

import type { AuthForm, AuthMode } from '../types/auth'
import type { Location } from '../types/location'

// Estado inicial de los formularios de autenticación.
const INITIAL_FORM: AuthForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  age: '',
  sex: '',
  idLocation: '',
}

export function useAuth() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const [form, setForm] = useState<AuthForm>({ ...INITIAL_FORM })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [locations, setLocations] = useState<Location[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)
  const [locationsError, setLocationsError] = useState('')

  // Carga las sedes disponibles al inicializar el hook.
  useEffect(() => {
    async function loadLocations() {
      try {
        setIsLoadingLocations(true)

        const data = await getLocations()
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
  }, [])

  // Actualiza un campo específico del formulario.
  function handleFormChange(field: keyof AuthForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  // Abre el modal y prepara un formulario limpio.
  function openAuth(mode: AuthMode) {
    setAuthMode(mode)
    setForm({ ...INITIAL_FORM })
    setMessage('')
  }

  // Cierra el modal y limpia los mensajes.
  function closeAuth() {
    setAuthMode(null)
    setMessage('')
  }

  // Procesa el inicio de sesión o el registro.
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
        const result = await login({
          email: form.email.trim(),
          password: form.password,
        })

        // TODO: integrar el token y los datos del usuario.
        console.log('Usuario autenticado:', result.user)

        setMessage('Inicio de sesión correcto.')
      } else if (authMode === 'register') {
        await register({
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
