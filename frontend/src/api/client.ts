import axios from 'axios'

// Instancia centralizada para todas las peticiones al backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api