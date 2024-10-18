// src/core/config/email.config.ts
import nodemailer, { Transporter } from "nodemailer";
import { env } from "./env";

export class EmailConfig {
  private static instance: EmailConfig;
  private transporter: Transporter;

  private constructor() {
    const emailHost = env.emailHost || "smtp.ionos.com"; // Default value
    const emailPort = Number(env.emailPort) || 587; // Default port
    const emailUser = env.emailUser;
    const emailPass = env.emailPass;

    if (!emailUser || !emailPass) {
      throw new Error(
        "Email credentials are missing. Please set 'emailUser' and 'emailPass' in the environment variables."
      );
    }

    const isSecure = emailPort === 465; // Secure if using port 465

    const smtpOptions = {
      host: emailHost,
      port: emailPort,
      secure: isSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      // Uncomment the following lines if you need to connect to a server with a self-signed certificate
      /*
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
      */
    };

    this.transporter = nodemailer.createTransport(smtpOptions);

    // Verify the SMTP connection
    this.verifyTransporter();
  }

  private async verifyTransporter(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log("SMTP server is ready to take messages.");
    } catch (error) {
      console.error("Error connecting to SMTP server:", error);
    }
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
