import { Validators } from "../../../shared";
import { RecipientTypes, NotificationTypes, StatusCodes } from "../../enums";
import { CustomError } from "../../errors";

export class CreateNotificationDTO {
  constructor(
    public readonly recipientId: string,
    public readonly recipientType: RecipientTypes,
    public readonly type: NotificationTypes,
    public readonly message: string,
    public readonly title: string,
    public readonly summary: string,
    public readonly status: StatusCodes,
    public readonly fieldToUpdate?: string, // Campo que se quiere actualizar (opcional)
    public readonly newValue?: string // Nuevo valor del campo (opcional)
  ) {}

  // Método de fábrica para crear un DTO con validación de campos
  static create(data: {
    recipientId: string;
    recipientType: RecipientTypes;
    type: NotificationTypes;
    message?: string;
    title: string;
    summary: string;
    status: StatusCodes;
    fieldToUpdate?: string; // Campo opcional
    newValue?: string; // Valor opcional
  }): [CustomError | null, CreateNotificationDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [
      null,
      new CreateNotificationDTO(
        data.recipientId,
        data.recipientType,
        data.type,
        data.message || `Pending approval for field: ${data.fieldToUpdate}`,
        data.title,
        data.summary,
        data.status,
        data.fieldToUpdate, // Guardar el campo que se quiere actualizar
        data.newValue // Guardar el nuevo valor que se quiere aplicar
      ),
    ];
  }

  // Validación de los campos del DTO
  private static validateFields(data: {
    recipientId: string;
    recipientType: RecipientTypes;
    type: NotificationTypes;
    title: string;
    summary: string;
    status: StatusCodes;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.recipientId))
      return CustomError.badRequest("Recipient ID is required");
    if (!Object.values(RecipientTypes).includes(data.recipientType))
      return CustomError.badRequest("Invalid recipient type");
    if (!Object.values(NotificationTypes).includes(data.type))
      return CustomError.badRequest("Invalid notification type");
    if (!Validators.isNotEmpty(data.title))
      return CustomError.badRequest("Title is required");
    if (!Validators.isNotEmpty(data.summary))
      return CustomError.badRequest("Summary is required");
    if (!Object.values(StatusCodes).includes(data.status))
      return CustomError.badRequest("Invalid status code");

    return null;
  }
}
