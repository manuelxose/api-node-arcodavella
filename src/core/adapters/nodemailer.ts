// src/adapters/NodemailerAdapter.ts

import nodemailer, { Transporter } from "nodemailer";
import { EmailConfig } from "../config/nodemailer.config";

/**
 * Opciones de correo electrónico utilizadas por el adaptador.
 */
export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: AttachmentOptions[];
}

/**
 * Opciones de adjuntos para el correo electrónico.
 */
export interface AttachmentOptions {
  filename?: string;
  path?: string;
  content?: string | Buffer;
  encoding?: string;
  contentType?: string;
  cid?: string;
}

/**
 * Adaptador que encapsula la librería Nodemailer.
 */
export class NodemailerAdapter {
  private transporter: Transporter;

  constructor() {
    const emailConfig = EmailConfig.getInstance();

    const isSecure = emailConfig.emailPort === 465; // Seguro si se utiliza el puerto 465

    const smtpOptions = {
      host: emailConfig.emailHost,
      port: emailConfig.emailPort,
      secure: isSecure,
      auth: {
        user: emailConfig.emailUser,
        pass: emailConfig.emailPass,
      },
      // Descomentar si necesitas conectarte a un servidor con certificado autofirmado
      /*
      tls: {
        rejectUnauthorized: false, // Permitir certificados autofirmados
      },
      */
    };

    this.transporter = nodemailer.createTransport(smtpOptions);

    // Verificar la conexión SMTP
    this.verifyTransporter();
  }

  private async verifyTransporter(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log("El servidor SMTP está listo para enviar mensajes.");
    } catch (error) {
      console.error("Error al conectar con el servidor SMTP:", error);
    }
  }

  /**
   * Envía un correo electrónico utilizando Nodemailer.
   * @param options - Opciones del correo electrónico.
   */
  public async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments?.map((att) => ({
        filename: att.filename,
        path: att.path,
        content: att.content,
        encoding: att.encoding,
        contentType: att.contentType,
        cid: att.cid,
      })),
    };

    await this.transporter.sendMail(mailOptions);
  }
}
