import { SendEmailDTO } from "../dtos/email";

/**
 * Clase abstracta EmailDataSource
 *
 * Proporciona un método genérico para enviar correos electrónicos.
 * La lógica específica de cada tipo de correo se maneja en el repositorio o caso de uso.
 */
export abstract class EmailDataSource {
  /**
   * Enviar un correo electrónico.
   * @param data - Datos necesarios para enviar el correo electrónico.
   */
  abstract sendEmail(data: SendEmailDTO): Promise<void>;
}
