// src/auth/dto/RegisterLoginDTO.ts

import { Validators } from "../../../shared";
import { CustomError } from "../../errors";

export class RegisterLoginDTO {
  public readonly email: string;
  public readonly ipAddress: string;
  public readonly timestamp: Date;

  private constructor(data: {
    email: string;
    ipAddress: string;
    timestamp: Date;
  }) {
    this.email = data.email;
    this.ipAddress = data.ipAddress;
    this.timestamp = data.timestamp;
  }

  /**
   * Crea una instancia de RegisterLoginDTO con validación de campos.
   * @param data Datos del inicio de sesión.
   * @returns Instancia de RegisterLoginDTO.
   * @throws CustomError si la validación falla.
   */
  static create(data: Partial<RegisterLoginDTO>): RegisterLoginDTO {
    const errors: { [key: string]: string } = {};

    // Validar que el email esté presente y no esté vacío
    if (!data.email || !Validators.isNotEmpty(data.email)) {
      errors.email = "Email is required.";
    } else if (!Validators.isValidEmail(data.email)) {
      errors.email = "Invalid email format.";
    }

    // Validar que la ipAddress esté presente y tenga un formato válido
    if (!data.ipAddress || !Validators.isNotEmpty(data.ipAddress)) {
      errors.ipAddress = "IP Address is required.";
    } else if (!Validators.isValidIPAddress(data.ipAddress)) {
      errors.ipAddress = "Invalid IP Address format.";
    }

    // Asignar timestamp actual si no se proporciona
    const timestamp = data.timestamp || new Date();

    // Si hay errores, lanzar un CustomError con los detalles
    if (Object.keys(errors).length > 0) {
      throw CustomError.badRequest(JSON.stringify(errors));
    }

    // Crear y retornar la instancia de DTO
    return new RegisterLoginDTO({
      email: data.email!,
      ipAddress: data.ipAddress!,
      timestamp,
    });
  }
}
