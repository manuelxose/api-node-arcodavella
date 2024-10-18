// src/domain/dtos/contacto/FetchContactsDTO.ts

import { CustomError } from "../../errors";
import { Validators } from "../../../shared/validators";

export class FetchContactsDTO {
  public readonly nombre: string;
  public readonly correo: string;
  public readonly telefono: string;

  private constructor(nombre: string, correo: string, telefono: string) {
    this.nombre = nombre;
    this.correo = correo;
    this.telefono = telefono;
  }

  /**
   * Factory method para crear una instancia de FetchContactsDTO.
   * @param data - Objeto que contiene nombre, correo y telefono.
   * @returns Una tupla con un posible error y el DTO creado.
   */
  static create(data: {
    nombre: string;
    correo: string;
    telefono: string;
  }): [CustomError | null, FetchContactsDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [
      null,
      new FetchContactsDTO(data.nombre, data.correo, data.telefono),
    ];
  }

  /**
   * Valida los campos del DTO.
   * @param data - Objeto que contiene nombre, correo y telefono.
   * @returns Un CustomError si hay un error de validación, o null si todo está bien.
   */
  private static validateFields(data: {
    nombre: string;
    correo: string;
    telefono: string;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.nombre)) {
      return CustomError.badRequest("El nombre es requerido");
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
