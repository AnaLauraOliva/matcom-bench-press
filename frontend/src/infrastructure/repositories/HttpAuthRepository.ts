import apiClient from '../http/apiClient'

import type { AuthRepository } from '../../application/ports/AuthRepository'

import type {
  LoginData,
  LoginResponse,
  RegisterClientData,
  RegisterResponse,
} from '../../application/dtos/auth'

export class HttpAuthRepository implements AuthRepository {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', data)

    return response.data as LoginResponse
  }

  async register(data: RegisterClientData): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', data)

    return response.data as RegisterResponse
  }
}