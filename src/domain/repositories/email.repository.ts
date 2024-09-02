import {
  SendPasswordResetEmailDTO,
  SendWelcomeEmailDTO,
  SendAccountVerificationEmailDTO,
} from "../dtos/email";

/**
 * Clase abstracta EmailRepository
 *
 * Define el contrato para cualquier implementación de un repositorio de correo electrónico.
 *
 * Se utiliza para asegurar que todas las implementaciones del repositorio de correo electrónico
 * sigan las mismas reglas y expongan los mismos métodos. Esto permite cambiar la implementación
 * del repositorio sin afectar al resto de la aplicación.
 */
export abstract class EmailRepository {
  /**
   * Enviar un correo electrónico de restablecimiento de contraseña.
   * @param dto - Datos necesarios para enviar el correo de restablecimiento de contraseña.
   */
  abstract sendPasswordResetEmail(
    dto: SendPasswordResetEmailDTO
  ): Promise<void>;

  /**
   * Enviar un correo electrónico de bienvenida.
   * @param dto - Datos necesarios para enviar el correo de bienvenida.
   */
  abstract sendWelcomeEmail(dto: SendWelcomeEmailDTO): Promise<void>;

  /**
   * Enviar un correo electrónico de verificación de cuenta.
   * @param dto - Datos necesarios para enviar el correo de verificación de cuenta.
   */
  abstract sendAccountVerificationEmail(
    dto: SendAccountVerificationEmailDTO
  ): Promise<void>;
}
