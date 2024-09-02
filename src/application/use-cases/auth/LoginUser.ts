import { AuthRepository } from "../../../domain/repositories";
import { LoginUserDTO } from "../../../domain/dtos/auth";
import { UserEntity } from "../../../domain/entities/auth";
import { CustomError } from "../../../domain/errors/custom.errors";
import { JwtAdapter } from "../../../core/adapters";

interface LoginResponse {
  user: UserEntity;
  token: string;
}

export class LoginUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(loginUserDTO: LoginUserDTO): Promise<LoginResponse> {
    // Intentar autenticar al usuario
    const user = await this.authRepository.login(loginUserDTO);

    if (!user) {
      throw CustomError.badRequest("Invalid credentials");
    }

    // Si la autenticación es exitosa, generar un token JWT
    const token = await JwtAdapter.generateToken({ userId: user.id });

    // Devolver la información del usuario junto con el token
    return {
      user,
      token,
    };
  }
}
