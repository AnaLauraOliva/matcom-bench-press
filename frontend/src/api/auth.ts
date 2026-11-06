import api from './client'
import type {
  LoginData,
  LoginResponse,
  RegisterClientData,
  RegisterResponse,
} from '../types/auth'

// Inicia sesión y devuelve el token y los datos del usuario.
export async function login(data: LoginData): Promise<LoginResponse> {
  const response = await api.post('/auth/login', data)

  return response.data as LoginResponse
}

// Registra un nuevo cliente.
export async function register(
  data: RegisterClientData,
): Promise<RegisterResponse> {
  const response = await api.post('/auth/register', data)

  return response.data as RegisterResponse
}