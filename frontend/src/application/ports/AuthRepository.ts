import type {
  LoginData,
  LoginResponse,
  RegisterClientData,
  RegisterResponse,
} from '../dtos/auth'

export interface AuthRepository {
  login(data: LoginData): Promise<LoginResponse>

  register(data: RegisterClientData): Promise<RegisterResponse>
}