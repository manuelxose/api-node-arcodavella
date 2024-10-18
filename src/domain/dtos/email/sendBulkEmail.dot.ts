// src/app/dtos/send-bulk-email.dto.ts
import { Validators } from "../../../shared/validators";

export class SendBulkEmailDTO {
  constructor(
    public readonly emails: Array<{
      to: string;
      subject: string;
      bodyText: string;
      bodyHtml: string;
      attachments?: Array<{
        filename: string;
        content: string; // Contenido del archivo en base64
        encoding: string; // Tipo de codificación, por ejemplo, 'base64'
        contentType: string; // Tipo MIME del archivo, por ejemplo, 'application/pdf'
      }>;
      dni?: string;
      memberNumber?: string;
      nombre?: string;
    }>
  ) {}

  static create(data: {
    emails: Array<{
      to: string;
      subject: string;
      bodyText: string;
      bodyHtml: string;
      attachments?: Array<{
        filename: string;
        content: string;
        encoding: string;
        contentType: string;
      }>;
      dni?: string;
      memberNumber?: string;
      nombre?: string;
    }>;
  }): [Error | null, SendBulkEmailDTO | null] {
    // Validación de que la lista de correos no esté vacía
    if (!data.emails || data.emails.length === 0) {
      return [new Error("At least one email is required"), null];
    }

    // Validar cada email en la lista
    for (const email of data.emails) {
      if (
        !Validators.isNotEmpty(email.to) ||
        !Validators.isNotEmpty(email.subject) ||
        !Validators.isNotEmpty(email.bodyText) ||
        !Validators.isNotEmpty(email.bodyHtml)
      ) {
        return [
          new Error("All emails must have to, subject, bodyText, and bodyHtml"),
          null,
        ];
      }

      // Validar formato del correo electrónico
      if (!Validators.isValidEmail(email.to)) {
        return [
          new Error(`Invalid email format for recipient: ${email.to}`),
          null,
        ];
      }

      // Validar los archivos adjuntos si existen
      if (email.attachments) {
        for (const attachment of email.attachments) {
          if (
            !Validators.isNotEmpty(attachment.filename) ||
            !Validators.isNotEmpty(attachment.content) ||
            !Validators.isNotEmpty(attachment.encoding) ||
            !Validators.isNotEmpty(attachment.contentType)
          ) {
            return [
              new Error(
                "All attachments must have filename, content, encoding, and contentType" +
                  attachment
              ),
              null,
            ];
          }

          // Opcional: Validar que el encoding sea 'base64'
          if (attachment.encoding !== "base64") {
            return [
              new Error(
                `Unsupported encoding for attachment: ${attachment.encoding}`
              ),
              null,
            ];
          }

          // Opcional: Validar que el content sea una cadena base64 válida
          if (!Validators.isValidBase64(attachment.content)) {
            return [
              new Error(
                `Invalid base64 content for attachment: ${attachment.filename}`
              ),
              null,
            ];
          }
        }
      }
    }

    // Si todas las validaciones pasan, se crea la instancia del DTO
    return [null, new SendBulkEmailDTO(data.emails)];
  }
}
