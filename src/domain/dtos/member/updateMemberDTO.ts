import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors";

export class UpdateMemberDTO {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly dni?: string,
    public readonly comments?: string,
    public readonly memberNumber?: string
  ) {}

  static create(data: {
    id: string;
    name?: string;
    email?: string;
    dni?: string;
    comments?: string;
    memberNumber?: string;
  }): [CustomError | null, UpdateMemberDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [
      null,
      new UpdateMemberDTO(
        data.id,
        data.name,
        data.email,
        data.dni,
        data.comments,
        data.memberNumber
      ),
    ];
  }

  private static validateFields(data: {
    id: string;
    name?: string;
    email?: string;
    dni?: string;
    comments?: string;
    memberNumber?: string;
  }): CustomError | null {
    // Validación de ID (obligatorio)
    if (!Validators.isNotEmpty(data.id)) {
      return CustomError.badRequest("ID is required");
    }

    // Validación de email (si se proporciona)
    if (data.email && !Validators.isValidEmail(data.email)) {
      return CustomError.badRequest("Invalid email format");
    }

    // Validación de DNI (si se proporciona)
    if (data.dni && !Validators.isValidDNI(data.dni)) {
      return CustomError.badRequest("Invalid DNI format");
    }

    // Validación de nombre (si se proporciona, no debe estar vacío)
    if (data.name && !Validators.isNotEmpty(data.name)) {
      return CustomError.badRequest("Name cannot be empty");
    }

    if (data.memberNumber) {
      if (!Validators.isValidMemberNumber(data.memberNumber)) {
        return CustomError.badRequest("Invalid member number format");
      }
    }

    // Validación de comentarios (si se proporcionan, no deben estar vacíos y no deben exceder un límite)
    if (data.comments) {
      if (!Validators.isNotEmpty(data.comments)) {
        return CustomError.badRequest("Comments cannot be empty if provided");
      }

      if (!Validators.isValidComments(data.comments)) {
        return CustomError.badRequest(
          "Comments must not exceed 200 characters"
        );
      }
    }

    return null;
  }
}
