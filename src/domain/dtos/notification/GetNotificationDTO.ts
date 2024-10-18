// src/domain/dtos/notification/GetNotificationByIdDTO.ts

import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors";

export class GetNotificationByIdDTO {
  constructor(public readonly id: string) {}

  // Método de fábrica para crear un DTO con validación de campos
  static create(data: {
    id: string;
  }): [CustomError | null, GetNotificationByIdDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [null, new GetNotificationByIdDTO(data.id)];
  }

  // Validación de los campos del DTO
  private static validateFields(data: { id: string }): CustomError | null {
    if (!Validators.isNotEmpty(data.id))
      return CustomError.badRequest("ID is required");

    return null;
  }
}
