import { CustomError } from "../../errors";

/**
 * DTO para suscribir un contacto.
 */
export class SubscribeContactDTO {
  email: string;
  name: string;

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }

  /**
   * Crea una instancia de SubscribeContactDTO desde un objeto.
   * @param data - Objeto con los datos del contacto.
   * @returns [Error, SubscribeContactDTO | null]
   */
  static create(
    data: SubscribeContactDTO
  ): [Error | null, SubscribeContactDTO | null] {
    if (!data.email || !data.name) {
      return [CustomError.badRequest("Email y nombre son requeridos"), null];
    }

    return [null, new SubscribeContactDTO(data.email, data.name)];
  }
}
