import { AuthRepository, EmailRepository } from "../../../domain/repositories";
import { JwtAdapter } from "../../../core/adapters";
import { CustomError } from "../../../domain/errors/custom.errors";
import {
  GetActiveUserByEmailDTO,
  RequestPasswordResetDTO,
} from "../../../domain/dtos/auth";
import { SendPasswordResetEmailDTO } from "../../../domain/dtos/email";

interface PasswordResetResponseDTO {
  message: string;
  resetToken?: string; // Opcional, en caso de que se desee devolver el token para pruebas o logs (en producción usualmente no se devuelve)
}

export class RequestPasswordReset {
  constructor(
    private authRepository: AuthRepository,
    private emailRepository: EmailRepository
  ) {}

  async execute(
    requestPasswordResetDTO: RequestPasswordResetDTO
  ): Promise<PasswordResetResponseDTO> {
    // Validar el DTO de solicitud de restablecimiento de contraseña
    const [error, dto] = RequestPasswordResetDTO.create(
      requestPasswordResetDTO
    );
    if (error) {
      throw CustomError.badRequest(error.message);
    }

    // Crear un DTO para obtener el usuario por email
    const [getActiveUserError, getActiveUserDto] =
      GetActiveUserByEmailDTO.create({ email: dto!.email });
    if (getActiveUserError) {
      throw CustomError.badRequest(getActiveUserError.message);
    }

    // Obtener el usuario por email usando el DTO
    const user = await this.authRepository.getActiveUserByEmail(
      getActiveUserDto!
    );

    // Si el usuario no existe, devolver un mensaje genérico (sin enumeración)
    if (!user) {
      return {
        message:
          "If an account with this email exists, a reset link has been sent.",
      };
    }

    // Generar el token de restablecimiento de contraseña con seguridad mejorada
    const resetToken = await JwtAdapter.generateToken(
      { userId: user.id },
      undefined, // Usa una clave segura de firma en la implementación del adaptador
      "1h" // Token válido por 1 hora
    );

    // Crear el DTO para enviar el correo de restablecimiento de contraseña
    const [sendEmailError, sendEmailDto] = SendPasswordResetEmailDTO.create({
      email: user.email,
      resetToken,
    });

    if (sendEmailError) {
      throw CustomError.badRequest(sendEmailError.message);
    }

    // Enviar el correo de restablecimiento usando el DTO
    await this.emailRepository.sendPasswordResetEmail(sendEmailDto!);

    // Devolver un mensaje de éxito
    return {
      message: "A reset link has been sent to your email.",
    };
  }
}
