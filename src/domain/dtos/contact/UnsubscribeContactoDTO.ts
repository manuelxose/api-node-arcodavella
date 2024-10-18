// src/domain/dtos/contacto/UnsubscribeContactoDTO.ts

import { CustomError } from "../../../domain/errors";
import { Validators } from "../../../shared/validators";

export class UnsubscribeContactoDTO {
  public readonly correo: string;

  private constructor(correo: string) {
    this.correo = correo;
  }

  /**
   * Factory method para crear una instancia de UnsubscribeContactoDTO.
   * @param data - Objeto que contiene el correo.
   * @returns Una tupla con un posible error y el DTO creado.
   */
  static create(data: {
    correo: string;
  }): [CustomError | null, UnsubscribeContactoDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [null, new UnsubscribeContactoDTO(data.correo)];
  }

  /**
   * Valida los campos del DTO.
   * @param data - Objeto que contiene el correo.
   * @returns Un CustomError si hay un error de validación, o null si todo está bien.
   */
  private static validateFields(data: { correo: string }): CustomError | null {
    if (!Validators.isValidEmail(data.correo)) {
      return CustomError.badRequest("Correo electrónico inválido");
    }

    return null;
  }
}
