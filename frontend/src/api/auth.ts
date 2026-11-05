
import axios from 'axios'

const api = axios.create({
  // URL configurada en frontend/.env.local
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type LoginData = {
  email: string
  password: string
}

export type RegisterClientData = {
  name: string
  email: string
  phone: string
  password: string
  role: 'CLIENT'
  age: number
  sex: 'FEMENINO' | 'MASCULINO' | 'OTRO'
  idLocation: number
}

export async function login(data: LoginData) {
  const response = await api.post('/login', data)

  return response.data as {
    token: string
    user: unknown
  }
}

export async function register(data: RegisterClientData) {
  const response = await api.post('/register', data)

  return response.data as {
    user: unknown
  }
}

const locationsApi = axios.create({
  baseURL: 'http://localhost:3000/api/locations',
  headers: {
    'Content-Type': 'application/json',
  },
})

export type Location = {
  idLocation: number
  name: string
}

export async function getLocations() {
  const response = await locationsApi.get('/')

  return response.data.locations as Location[]
}