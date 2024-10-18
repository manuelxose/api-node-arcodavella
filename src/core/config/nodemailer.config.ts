// src/core/config/email.config.ts

import { env } from "./env";

/**
 * Clase de configuración para el correo electrónico.
 *
 * Proporciona los ajustes necesarios para el envío de correos.
 */
export class EmailConfig {
  private static instance: EmailConfig;

  public readonly emailHost: string;
  public readonly emailPort: number;
  public readonly emailUser: string;
  public readonly emailPass: string;

  private constructor() {
    this.emailHost = env.emailHost;
    this.emailPort = env.emailPort;
    this.emailUser = env.emailUser;
    this.emailPass = env.emailPass;
  }

  public static getInstance(): EmailConfig {
    if (!EmailConfig.instance) {
      EmailConfig.instance = new EmailConfig();
    }
    return EmailConfig.instance;
  }
}
