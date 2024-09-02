import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport"; // Importa SMTPTransport
import { env } from "./env";

export class EmailConfig {
  private static instance: EmailConfig;
  private transporter: Transporter;

  private constructor() {
    const emailHost = env.emailHost || "smtp.ionos.com"; // Valor por defecto
    const emailPort = parseInt(env.emailPort || "587", 10); // Valor por defecto y conversión a número
    const emailUser = env.emailUser;
    const emailPass = env.emailPass;

    if (!emailUser || !emailPass) {
      throw new Error(
        "Faltan credenciales de correo electrónico (usuario o contraseña)."
      );
    }

    const smtpOptions: SMTPTransport.Options = {
      host: emailHost,
      port: emailPort,
      secure: false, // true para el puerto 465, false para 587
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false, // Para evitar problemas con certificados
      },
    };

    this.transporter = nodemailer.createTransport(smtpOptions);

    // Verificar la conexión al servidor SMTP
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("Error al conectar con el servidor SMTP:", error);
      } else {
        console.log("Servidor SMTP conectado con éxito:", success);
      }
    });
  }

  public static getInstance(): EmailConfig {
    if (!EmailConfig.instance) {
      EmailConfig.instance = new EmailConfig();
    }
    return EmailConfig.instance;
  }

  public getTransporter(): Transporter {
    return this.transporter;
  }
}
