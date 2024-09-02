import { AuthRepository } from "../../../domain/repositories/auth.repository";
import { ResetPasswordDTO, UpdatePasswordDTO } from "../../../domain/dtos/auth";
import { CustomError } from "../../../domain/errors/custom.errors";
import { JwtAdapter, BcryptAdapter } from "../../../core/adapters";

export class ResetPassword {
  constructor(private authRepository: AuthRepository) {}

  async execute(resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    const [error, dto] = ResetPasswordDTO.create(resetPasswordDTO);
    if (error) {
      throw CustomError.badRequest(error.message);
    }

    // Verificar la validez del token
    const decoded = await JwtAdapter.validateToken<{ userId: string }>(
      dto!.token
    );
    const user = await this.authRepository.getActiveUser({
      userId: decoded.userId,
    });

    if (!user) {
      throw CustomError.badRequest("Invalid token or user not found");
    }

    // Hash la nueva contraseña utilizando el método estático
    const hashedPassword = BcryptAdapter.hash(dto!.newPassword);

    // Crear el DTO para actualizar la contraseña
    const [updateError, updatePasswordDTO] = UpdatePasswordDTO.create({
      userId: user.id,
      newPassword: hashedPassword,
    });

    if (updateError) {
      throw CustomError.badRequest(updateError.message);
    }

    // Actualizar la contraseña del usuario en el repositorio usando el DTO
    await this.authRepository.updatePassword(updatePasswordDTO!);
  }
}
