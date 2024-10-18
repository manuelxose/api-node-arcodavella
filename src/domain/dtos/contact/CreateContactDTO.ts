// src/domain/dtos/contacto/CreateContactoDTO.ts

import { CustomError } from "../../errors";
import { Validators } from "../../../shared/validators";

export class CreateContactoDTO {
  constructor(
    public readonly nombre: string,
    public readonly correo: string,
    public readonly telefono: string
  ) {}

  static create(data: {
    nombre: string;
    correo: string;
    telefono: string;
  }): [CustomError | null, CreateContactoDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [
      null,
      new CreateContactoDTO(data.nombre, data.correo, data.telefono),
    ];
  }

  private static validateFields(data: {
    nombre: string;
    correo: string;
    telefono: string;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.nombre)) {
      return CustomError.badRequest("Nombre es requerido");
    }

    if (!Validators.isValidEmail(data.correo)) {
      return CustomError.badRequest("Correo electrónico inválido");
    }

    if (!Validators.isValidPhoneNumber(data.telefono)) {
      return CustomError.badRequest("Número de teléfono inválido");
    }

    return null;
  }
}
