import { AuthRepository } from "../../../domain/repositories";
import { ChangePasswordDTO, GetActiveUserDTO } from "../../../domain/dtos/auth";
import { CustomError } from "../../../domain/errors";
import { BcryptAdapter, JwtAdapter } from "../../../core/adapters";
import logger from "../../../core/adapters/logger";

interface ResponsePass {
  success: boolean;
  message: string;
}

export class ChangePassword {
  constructor(private authRepository: AuthRepository) {}

  async execute(changePasswordDTO: ChangePasswordDTO): Promise<ResponsePass> {
    const { token } = changePasswordDTO;

    // Decodificar el token para obtener el userId
    let userId: string;
    try {
      const decodedToken = await JwtAdapter.validateToken<{ userId: string }>(
        token
      );
      userId = decodedToken.userId;
      console.log("id decodificado: ", userId);
    } catch (error: unknown) {
      logger.error("Invalid or expired Token", error);
      throw CustomError.unauthorized("Invalid or expired token.");
    }

    // Crear DTO para obtener el usuario activo
    const [dtoError, getActiveUserDTO] = GetActiveUserDTO.create({ userId });

    if (dtoError || !getActiveUserDTO) {
      throw CustomError.badRequest("Invalid user ID.");
    }

    // Buscar el usuario en la base de datos usando el DTO
    const user = await this.authRepository.getActiveUser(getActiveUserDTO);

    if (!user) {
      throw CustomError.notFound("User not found.");
    }
    const hashedPassword = BcryptAdapter.hash(changePasswordDTO.newPassword);

    // Intentar cambiar la contraseña a través del repositorio de autenticación
    try {
      await this.authRepository.updatePassword({
        userId: user.id, // Esto asume que el método changePassword usa userId, no el token
        newPassword: hashedPassword,
      });

      return {
        success: true,
        message: "Password changed successfully.",
      };
    } catch (error: unknown) {
      if (error instanceof Error)
        logger.error(
          "Failed to change password. Please try again.",
          error.message
        );

      throw CustomError.internal(
        "Failed to change password. Please try again."
      );
    }
  }
}
