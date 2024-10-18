import { AuthRepository } from "../../../domain/repositories";
import { LoginUserDTO } from "../../../domain/dtos/auth";
import { CustomError } from "../../../domain/errors/custom.errors";
import { JwtAdapter } from "../../../core/adapters";
import { LoginResponse } from "../../interfaces";

export class LoginUser {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Ejecuta el proceso de inicio de sesión del usuario.
   * @param loginUserDTO Datos necesarios para el inicio de sesión.
   * @returns Respuesta que incluye la información del usuario y el token JWT.
   */
  async execute(loginUserDTO: LoginUserDTO): Promise<LoginResponse> {
    // Autenticar usuario a través del repositorio
    const user = await this.authRepository.login(loginUserDTO);

    // Validar usuario
    if (!user) {
      throw CustomError.badRequest("Credenciales inválidas");
    }

    // Generar el token JWT
    const token = await JwtAdapter.generateToken({
      userId: user.id,
      role: user.role,
    });

    // Desestructurar las propiedades necesarias del usuario
    const {
      id,
      role,
      email,
      memberNumber = "",
      status,
      name = "",
      phone = "",
      dni = "",
      accountNumber = "",
      updatedAt,
    } = user;

    // Devolver el objeto de respuesta con los datos desestructurados y el token
    return {
      user: {
        email,
        role,
        id,
        memberNumber,
        status,
        name,
        phone,
        dni,
        accountNumber,
        updatedAt,
      },
      token,
    };
  }
}
