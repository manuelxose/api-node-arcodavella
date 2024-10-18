// src/domain/dtos/email/send-email.dto.ts

import { Validators } from "../../../shared/validators";

export interface Attachment {
  filename: string;
  content: string; // Contenido codificado en base64
  encoding: string; // Por ejemplo, 'base64'
  contentType: string; // Tipo MIME, por ejemplo, 'application/pdf'
  cid?: string; // Content-ID para imágenes inline
  path?: string;
}

export class SendEmailDTO {
  public readonly to: string;
  public readonly subject: string;
  public readonly bodyText?: string;
  public readonly bodyHtml?: string;
  public readonly attachments?: Array<Attachment>;

  constructor(
    to: string,
    subject: string,
    bodyText?: string,
    bodyHtml?: string,
    attachments?: Array<{
      filename: string;
      content: string;
      encoding: string;
      contentType: string;
    }>
  ) {
    this.to = to;
    this.subject = subject;
    this.bodyText = bodyText;
    this.bodyHtml = bodyHtml;
    this.attachments = attachments;
  }

  /**
   * Crea y valida una instancia de SendEmailDTO.
   * @param data Datos necesarios para crear SendEmailDTO.
   * @returns Una tupla con un error (si ocurre) y la instancia de SendEmailDTO.
   */
  static create(data: {
    to: string;
    subject: string;
    bodyText?: string;
    bodyHtml?: string;
    attachments?: Array<{
      filename: string;
      content: string;
      encoding: string;
      contentType: string;
    }>;
  }): [Error | null, SendEmailDTO | null] {
    // Validar campos requeridos
    if (
      !Validators.isNotEmpty(data.to) ||
      !Validators.isNotEmpty(data.subject)
    ) {
      return [new Error('Los campos "to" y "subject" son obligatorios.'), null];
    }

    // Validar formato del correo electrónico
    if (!Validators.isValidEmail(data.to)) {
      return [
        new Error(`Formato de correo electrónico inválido: ${data.to}`),
        null,
      ];
    }

    // Validar los archivos adjuntos si existen
    if (data.attachments) {
      for (const attachment of data.attachments) {
        if (
          !Validators.isNotEmpty(attachment.filename) ||
          !Validators.isNotEmpty(attachment.content) ||
          !Validators.isNotEmpty(attachment.encoding) ||
          !Validators.isNotEmpty(attachment.contentType)
        ) {
          return [
            new Error(
              "Todos los adjuntos deben tener filename, content, encoding y contentType."
            ),
            null,
          ];
        }

        // Validar que el encoding sea 'base64'
        if (attachment.encoding !== "base64") {
          return [
            new Error(
              `Encoding no soportado para el adjunto: ${attachment.encoding}`
            ),
            null,
          ];
        }

        // Validar que el content sea una cadena base64 válida
        if (!Validators.isValidBase64(attachment.content)) {
          return [
            new Error(
              `Contenido base64 inválido para el adjunto: ${attachment.filename}`
            ),
            null,
          ];
        }
      }
    }

    // Crear la instancia del DTO
    const sendEmailDTO = new SendEmailDTO(
      data.to,
      data.subject,
      data.bodyText,
      data.bodyHtml,
      data.attachments
    );

    return [null, sendEmailDTO];
  }
}
