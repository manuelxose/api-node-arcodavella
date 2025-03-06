import { EmailRepository } from "../../domain/repositories";
import { EmailDataSource } from "../../domain/datasources";
import {
  SendPasswordResetEmailDTO,
  SendWelcomeEmailDTO,
  SendAccountVerificationEmailDTO,
  SendPasswordChangedNotificationDTO,
  SendEmailDTO,
  SendBulkEmailDTO,
} from "../../domain/dtos/email";
import { env } from "../../core/config/env";

/**
 * Implementación concreta de EmailRepository utilizando un EmailDataSource.
 *
 * Este repositorio encapsula la lógica de negocio relacionada con los correos electrónicos
 * y delega el envío de correos al EmailDataSource utilizando directamente los DTOs.
 */
export class NodemailerEmailRepository implements EmailRepository {
  constructor(private readonly emailDataSource: EmailDataSource) {}

  async sendPasswordResetEmail(dto: SendPasswordResetEmailDTO): Promise<void> {
    let resetLink = ""; // Usamos 'let' ya que el valor va a cambiar

    if (process.env.NODE_ENV === "production") {
      resetLink = `${env.frontendUrl}/auth/new-password?token=${dto.resetToken}`;
    } else {
      resetLink = `http://localhost:4200/auth/new-password?token=${dto.resetToken}`;
    }

    const emailContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Restablecimiento de Contraseña</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #dddddd;
          }
          .header img {
            max-width: 150px;
          }
          .content {
            padding: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            font-size: 16px;
            color: #ffffff !important;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            border-top: 1px solid #dddddd;
            padding-top: 10px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://arcodavella.gal/wp-content/uploads/2020/01/Logo-Arco-da-Vella-1980x760.png" alt="arcodavella">
          </div>
          <div class="content">
            <h2>Restablecimiento de Contraseña</h2>
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para establecer una nueva contraseña:</p>
            <a href="${resetLink}" class="button">Restablecer Contraseña</a>
            <p>Si no solicitaste este cambio, puedes ignorar este correo electrónico de manera segura.</p>
            <p>Gracias por confiar en nosotros,<br>El equipo de Arco da Vella</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Arco da Vella. Todos los derechos reservados.
          </div>
        </div>
      </body>
    </html>
  `;

    const emailDTO = new SendEmailDTO(
      dto.email,
      "Restablecimiento de Contraseña",
      "",
      emailContent
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

  async sendBulkEmail(dto: SendBulkEmailDTO): Promise<void> {
    return this.emailDataSource.sendBulkEmail(dto);
  }

  async sendEmail(dto: SendEmailDTO): Promise<void> {
    return this.emailDataSource.sendEmail(dto);
  }
}
