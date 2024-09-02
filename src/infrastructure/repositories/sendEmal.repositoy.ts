import { EmailRepository } from "../../domain/repositories";
import { EmailDataSource } from "../../domain/datasources";
import {
  SendPasswordResetEmailDTO,
  SendWelcomeEmailDTO,
  SendAccountVerificationEmailDTO,
  SendPasswordChangedNotificationDTO,
  SendEmailDTO,
} from "../../domain/dtos/email";

/**
 * Implementación concreta de EmailRepository utilizando un EmailDataSource.
 *
 * Este repositorio encapsula la lógica de negocio relacionada con los correos electrónicos
 * y delega el envío de correos al EmailDataSource utilizando directamente los DTOs.
 */
export class NodemailerEmailRepository implements EmailRepository {
  constructor(private readonly emailDataSource: EmailDataSource) {}

  async sendPasswordResetEmail(dto: SendPasswordResetEmailDTO): Promise<void> {
    const emailDTO = new SendEmailDTO(
      dto.email,
      "Restablecimiento de contraseña",
      `Puedes restablecer tu contraseña usando el siguiente enlace: http://localhost/api/auth/reset-pasword?token=${dto.resetToken}`
    );
    await this.emailDataSource.sendEmail(emailDTO);
  }

  async sendWelcomeEmail(dto: SendWelcomeEmailDTO): Promise<void> {
    const emailDTO = new SendEmailDTO(
      dto.email,
      "Bienvenido a nuestra plataforma",
      `HolaS, bienvenido a nuestra plataforma. Estamos emocionados de tenerte con nosotros.`
    );
    await this.emailDataSource.sendEmail(emailDTO);
  }

  async sendAccountVerificationEmail(
    dto: SendAccountVerificationEmailDTO
  ): Promise<void> {
    const emailDTO = new SendEmailDTO(
      dto.email,
      "Verificación de cuenta",
      `Por favor, verifica tu cuenta usando el siguiente enlace: http://localhost/api/auth/veryfy-acc?token=${dto.verificationToken}`
    );
    await this.emailDataSource.sendEmail(emailDTO);
  }

  async sendPasswordChangedNotification(
    dto: SendPasswordChangedNotificationDTO
  ): Promise<void> {
    const emailDTO = new SendEmailDTO(
      dto.email,
      "Notificación de cambio de contraseña",
      `Tu contraseña ha sido cambiada exitosamente. Si no reconoces esta acción, contacta con soporte.`
    );
    await this.emailDataSource.sendEmail(emailDTO);
  }
}
