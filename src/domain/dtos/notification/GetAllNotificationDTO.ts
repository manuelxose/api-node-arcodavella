import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors";
import { RecipientTypes } from "../../enums/RecipientTypes";
import { NotificationTypes } from "../../enums/NotificationTypes";
import { StatusCodes } from "../../enums/StatusCodes";

export class GetAllNotificationsDTO {
  constructor(
    public readonly id: string,
    public readonly recipientId: string,
    public readonly recipientType: RecipientTypes,
    public readonly type: NotificationTypes,
    public readonly message: string,
    public readonly status: StatusCodes,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly fieldToUpdate?: string, // Campo opcional
    public readonly newValue?: string // Campo opcional
  ) {}

  // Método de fábrica para crear un DTO con validación de campos
  static create(data: {
    id: string;
    recipientId: string;
    recipientType: RecipientTypes;
    type: NotificationTypes;
    message: string;
    status: StatusCodes;
    createdAt: Date;
    updatedAt: Date;
    fieldToUpdate?: string;
    newValue?: string;
  }): [CustomError | null, GetAllNotificationsDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [
      null,
      new GetAllNotificationsDTO(
        data.id,
        data.recipientId,
        data.recipientType,
        data.type,
        data.message,
        data.status,
        data.createdAt,
        data.updatedAt,
        data.fieldToUpdate, // Campo opcional
        data.newValue // Campo opcional
      ),
    ];
  }

  // Validación de los campos del DTO
  private static validateFields(data: {
    id: string;
    recipientId: string;
    recipientType: RecipientTypes;
    type: NotificationTypes;
    message: string;
    status: StatusCodes;
    createdAt: Date;
    updatedAt: Date;
    fieldToUpdate?: string;
    newValue?: string;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.id))
      return CustomError.badRequest("ID is required");
    if (!Validators.isNotEmpty(data.recipientId))
      return CustomError.badRequest("Recipient ID is required");
    if (!Object.values(RecipientTypes).includes(data.recipientType))
      return CustomError.badRequest("Invalid recipient type");
    if (!Object.values(NotificationTypes).includes(data.type))
      return CustomError.badRequest("Invalid notification type");
    if (!Validators.isNotEmpty(data.message))
      return CustomError.badRequest("Message is required");
    if (!Object.values(StatusCodes).includes(data.status))
      return CustomError.badRequest("Invalid status code");
    if (!data.createdAt)
      return CustomError.badRequest("CreatedAt date is required");
    if (!data.updatedAt)
      return CustomError.badRequest("UpdatedAt date is required");

    // Opcional: No se valida si están vacíos porque son opcionales
    return null;
  }
}
