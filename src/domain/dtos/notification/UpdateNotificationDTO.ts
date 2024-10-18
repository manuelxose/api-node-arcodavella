import { Validators } from "../../../shared";
import { StatusCodes } from "../../enums";
import { CustomError } from "../../errors";

export class UpdateNotificationDTO {
  constructor(
    public readonly id: string,
    public readonly status?: StatusCodes,
    public readonly title?: string,
    public readonly summary?: string,
    public readonly message?: string,
    public readonly fieldToUpdate?: string, // Campo solicitado para modificación (opcional)
    public readonly newValue?: string // Nuevo valor propuesto (opcional)
  ) {}

  // Método de fábrica para crear un DTO con validación de campos
  static create(data: {
    id: string;
    status?: StatusCodes;
    summary?: string;
    title?: string;
    message?: string;
    fieldToUpdate?: string;
    newValue?: string;
  }): [CustomError | null, UpdateNotificationDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [
      null,
      new UpdateNotificationDTO(
        data.id,
        data.status,
        data.title,
        data.summary,
        data.message,
        data.fieldToUpdate, // Añadir campo solicitado para modificación
        data.newValue // Añadir nuevo valor propuesto
      ),
    ];
  }

  // Validación de los campos del DTO
  private static validateFields(data: {
    id: string;
    status?: StatusCodes;
    summary?: string;
    title?: string;
    message?: string;
    fieldToUpdate?: string;
    newValue?: string;
  }): CustomError | null {
    // Validar que el ID no esté vacío
    if (!Validators.isNotEmpty(data.id)) {
      return CustomError.badRequest("ID is required");
    }

    // Validar el status solo si se proporciona
    if (
      data.status !== undefined &&
      !Object.values(StatusCodes).includes(data.status)
    ) {
      return CustomError.badRequest("Invalid status code");
    }

    // No es necesario validar summary, title, message, fieldToUpdate o newValue aquí porque son opcionales
    return null;
  }
}
