import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors";

export class CreateMemberDTO {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly dni: string,
    public readonly memberNumber: string,
    public readonly comments: string = "" // Valor por defecto en el constructor
  ) {}

  static create(data: {
    name: string;
    email: string;
    dni: string;
    memberNumber: string;
    comments?: string; // Comentarios opcionales
  }): [CustomError | null, CreateMemberDTO | null] {
    // Validación completa de los campos
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    // Crear el objeto DTO si todas las validaciones pasan
    return [
      null,
      new CreateMemberDTO(
        data.name,
        data.email,
        data.dni,
        data.memberNumber,
        data.comments || ""
      ),
    ];
  }

  // Método separado para las validaciones
  private static validateFields(data: {
    name: string;
    email: string;
    dni: string;
    memberNumber: string;
    comments?: string;
  }): CustomError | null {
    // Validaciones de campos obligatorios

    if (!Validators.isNotEmpty(data.name)) {
      return CustomError.badRequest("Name is required");
    }

    if (!Validators.isNotEmpty(data.email)) {
      return CustomError.badRequest("Email is required");
    }

    if (!Validators.isNotEmpty(data.dni)) {
      return CustomError.badRequest("DNI is required");
    }

    if (!Validators.isNotEmpty(data.memberNumber)) {
      data.comments = "Falta numero de socio";
      // return CustomError.badRequest("Member number is required");
    }

    // Validaciones de formato
    if (!Validators.isValidEmail(data.email)) {
      return CustomError.badRequest("Invalid email format");
    }

    if (!Validators.isValidDNI(data.dni)) {
      data.comments = "DNI EN FORMATO INCORRECTO";
      // return CustomError.badRequest("Invalid DNI format");
    }

    if (!Validators.isValidMemberNumber(data.memberNumber)) {
      return CustomError.badRequest("Invalid member number format");
    }

    // Validación opcional de comentarios
    if (data.comments && !this.validateComments(data.comments)) {
      return CustomError.badRequest("Invalid comments format");
    }

    return null; // Si no hay errores, retorna null
  }

  // Método específico para validar comentarios
  private static validateComments(comments: string): boolean {
    return (
      Validators.isNotEmpty(comments) && Validators.isValidComments(comments)
    );
  }
}
