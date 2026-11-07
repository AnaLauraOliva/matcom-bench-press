import type { AuthRepository } from '../../ports/AuthRepository'
import type {
  RegisterClientData,
  RegisterResponse,
} from '../../dtos/auth'

export class RegisterClient {
  private readonly authRepository: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  execute(data: RegisterClientData): Promise<RegisterResponse> {
    return this.authRepository.register(data)
  }
}