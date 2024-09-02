import { EmailDataSource } from "../../domain/datasources";
import { SendEmailDTO } from "../../domain/dtos/email";
import { Transporter } from "nodemailer";
import { EmailConfig } from "../../core/config/nodemailer.config";
import { CustomError } from "../../domain/errors/custom.errors";
import { env } from "../../core/config/env";

/**
 * Implementación concreta de EmailDataSource usando Nodemailer.
 *
 * Proporciona un método genérico para enviar correos electrónicos.
 */
export class NodemailerEmailDataSource implements EmailDataSource {
  private transporter: Transporter;

  constructor() {
    const emailConfig = EmailConfig.getInstance();
    this.transporter = emailConfig.getTransporter();
  }

  async sendEmail(data: SendEmailDTO): Promise<void> {
    try {
      const mailOptions = {
        from: `"Soporte" <${env.emailUser}>`, // Remitente
        to: data.to, // Destinatario
        subject: data.subject, // Asunto
        text: data.bodyText, // Texto del cuerpo
      };

      console.log("Mail options:", mailOptions);

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      if (error instanceof Error) {
        // Manejar errores específicos de nodemailer, si se desea
        throw CustomError.internal(`Failed to send email: ${error.message}`);
      }
      // Manejar cualquier otro tipo de error
      throw CustomError.internal(
        "An unexpected error occurred while sending the email."
      );
    }
  }
}
