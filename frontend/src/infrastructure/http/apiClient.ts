import axios from 'axios'
import { AUTH_SESSION_KEY } from '../repositories/LocalStorageSessionRepository'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Añadimos automáticamente el token a las peticiones autenticadas.
apiClient.interceptors.request.use((config) => {
  const storedSession = localStorage.getItem(AUTH_SESSION_KEY)

  if (storedSession) {
    try {
      const session = JSON.parse(storedSession) as { token: string }

      config.headers.Authorization = `Bearer ${session.token}`
    } catch (error) {
      console.error('No se pudo recuperar el token:', error)
    }
  }

  return config
})

export default apiClient