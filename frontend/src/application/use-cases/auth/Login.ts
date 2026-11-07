import type { AuthRepository } from '../../ports/AuthRepository'
import type { LoginData, LoginResponse } from '../../dtos/auth'

export class Login {
  private readonly authRepository: AuthRepository

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  execute(data: LoginData): Promise<LoginResponse> {
    return this.authRepository.login(data)
  }
}