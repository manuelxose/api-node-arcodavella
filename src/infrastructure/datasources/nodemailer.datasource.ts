import { EmailDataSource } from "../../domain/datasources";
import { SendEmailDTO, SendBulkEmailDTO } from "../../domain/dtos/email";
import { Transporter } from "nodemailer";
import { EmailConfig } from "../../core/config/nodemailer.config";
import { CustomError } from "../../domain/errors/custom.errors";
import { env } from "../../core/config/env";

/**
 * Implementación concreta de EmailDataSource usando Nodemailer.
 *
 * Proporciona métodos para enviar correos electrónicos individuales y en masa.
 */
export class NodemailerEmailDataSource implements EmailDataSource {
  private transporter: Transporter;

  constructor() {
    const emailConfig = EmailConfig.getInstance();
    this.transporter = emailConfig.getTransporter();
  }

  /**
   * Envía un correo electrónico individual.
   * @param data - Datos del correo a enviar.
   */
  async sendEmail(data: SendEmailDTO): Promise<void> {
    try {
      const mailOptions: any = {
        // Usar any para evitar problemas de tipado temporal
        from: `"Soporte" <${env.emailUser}>`,
        to: data.to,
        subject: data.subject,
        text: data.bodyText,
        html: data.bodyHtml,
        attachments: data.attachments?.map((att) => {
          const attachment: any = {
            filename: att.filename,
            cid: att.cid, // Content-ID para imágenes inline
          };

          if (att.path) {
            attachment.path = att.path; // Ruta absoluta al archivo
          }

          if (att.content) {
            attachment.content = att.content; // Contenido en base64
            attachment.encoding = att.encoding;
            attachment.contentType = att.contentType;
          }

          return attachment;
        }),
      };

      console.log("Enviando correo a:", data.to);

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      if (error instanceof Error) {
        throw CustomError.internal(`Error al enviar correo: ${error.message}`);
      }
      throw CustomError.internal(
        "Ocurrió un error inesperado al enviar el correo."
      );
    }
  }

  /**
   * Envía correos electrónicos en masa de manera robusta, manejando límites y errores.
   * @param data - Datos de los correos a enviar en masa.
   */
  async sendBulkEmail(data: SendBulkEmailDTO): Promise<void> {
    try {
      const BATCH_SIZE = 50; // Ajusta según los límites de IONOS y tus necesidades
      const DELAY_BETWEEN_BATCHES_MS = 1000 * 60; // 1 minuto entre lotes, ajustar según sea necesario
      const MAX_RETRIES = 3; // Número máximo de reintentos para enviar un correo
      const DELAY_BETWEEN_RETRIES_MS = 1000; // 1 segundo entre reintentos, con backoff exponencial

      const totalEmails = data.emails.length;
      let sentEmails = 0;

      // Dividir los correos en lotes
      for (let i = 0; i < totalEmails; i += BATCH_SIZE) {
        const batch = data.emails.slice(i, i + BATCH_SIZE);

        console.log(
          `Enviando lote de correos ${i + 1} a ${i + batch.length}...`
        );

        // Enviar cada correo en el lote con reintentos
        const sendPromises = batch.map((email) =>
          this.sendEmailWithRetry(email, MAX_RETRIES, DELAY_BETWEEN_RETRIES_MS)
            .then(() => ({ success: true, email }))
            .catch((error: any) => ({ success: false, email, error }))
        );

        // Esperar a que se completen todos los envíos del lote
        const results = await Promise.all(sendPromises);

        // Procesar los resultados
        for (const result of results) {
          if (result.success) {
            console.log(`Correo enviado exitosamente a ${result.email.to}`);
          } else {
            console.error(`Error al enviar correo a ${result.email.to}`);
            // Aquí puedes agregar lógica adicional, como registrar el error en una base de datos
          }
        }

        sentEmails += batch.length;

        // Si hay más correos por enviar, esperar antes de enviar el siguiente lote
        if (sentEmails < totalEmails) {
          console.log(
            `Esperando ${
              DELAY_BETWEEN_BATCHES_MS / 1000
            } segundos antes de enviar el siguiente lote...`
          );
          await this.delay(DELAY_BETWEEN_BATCHES_MS);
        }
      }

      console.log(
        `Proceso de envío en masa completado. Correos enviados: ${sentEmails}`
      );
    } catch (error: any) {
      console.error(`Error al enviar correos en masa: ${error.message}`);
      throw CustomError.internal(
        `Failed to send bulk emails: ${error.message}`
      );
    }
  }

  /**
   * Envía un correo electrónico con reintentos en caso de fallo.
   * @param data - Datos del correo a enviar.
   * @param retries - Número máximo de reintentos.
   * @param delayMs - Tiempo de espera entre reintentos.
   */
  async sendEmailWithRetry(
    data: SendEmailDTO,
    retries = 3,
    delayMs = 1000
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.sendEmail(data);
        return; // Salir si el envío es exitoso
      } catch (error: any) {
        console.error(
          `Intento ${attempt} de ${retries} fallido para ${data.to}: ${error.message}`
        );
        if (attempt === retries) {
          throw error; // Re-lanzar el error si se agotaron los intentos
        }
        // Esperar antes del próximo intento
        const delayTime = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(
          `Esperando ${delayTime / 1000} segundos antes del próximo intento...`
        );
        await this.delay(delayTime);
      }
    }
  }

  /**
   * Retorna una promesa que se resuelve después de un tiempo especificado.
   * @param ms - Tiempo en milisegundos para esperar.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
