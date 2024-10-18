import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors";

export class UpdateAttendanceDTO {
  constructor(
    public readonly id: string, // Se necesita el ID para identificar el registro
    public readonly name?: string,
    public readonly email?: string,
    public readonly dni?: string,
    public readonly memberNumber?: string,
    public readonly entry?: string,
    public readonly date?: Date // Opcional si se quiere actualizar la fecha
  ) {}

  static create(data: {
    id: string;
    name?: string;
    email?: string;
    dni?: string;
    memberNumber?: string;
    entry?: string;
    date?: Date;
  }): [CustomError | null, UpdateAttendanceDTO | null] {
    // Validación de los campos
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [
      null,
      new UpdateAttendanceDTO(
        data.id,
        data.name,
        data.email,
        data.dni,
        data.memberNumber,
        data.entry,
        data.date
      ),
    ];
  }

  private static validateFields(data: {
    id: string;
    name?: string;
    email?: string;
    dni?: string;
    memberNumber?: string;
    entry?: string;
    date?: Date;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.id)) {
      return CustomError.badRequest("ID is required");
    }

    if (data.email && !Validators.isValidEmail(data.email)) {
      return CustomError.badRequest("Invalid email format");
    }

    if (
      data.memberNumber &&
      !Validators.isValidMemberNumber(data.memberNumber)
    ) {
      return CustomError.badRequest("Invalid member number format");
    }

    if (data.date && !Validators.isValidDate(data.date)) {
      return CustomError.badRequest("Invalid date format");
    }

    return null;
  }
}
