import { AuthRepository } from "../../../domain/repositories";

export class LogoutUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
