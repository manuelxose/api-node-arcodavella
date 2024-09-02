import { AuthRepository } from "../../../domain/repositories";
import { RegisterUserDTO } from "../../../domain/dtos/auth";

interface RegisterResponse {
  id: string;
  role: string;
  email: string;
}

export class RegisterUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<RegisterResponse> {
    const user = await this.authRepository.register(registerUserDTO);

    return {
      id: user.id,
      role: user.role,
      email: user.email,
    };
  }
}
