import { CustomError } from "../../../domain/errors";
import { Validators } from "../../../shared/validators";

export class CreateAttendanceDTO {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly dni: string,
    public readonly memberNumber: string,
    public readonly entry: string,
    public readonly date: Date
  ) {}

  // Método estático para validar y crear DTOs desde los datos de entrada
  static create(
    data: Array<{
      name: string;
      email: string;
      dni: string;
      memberNumber: string;
      entry: string;
      date: Date;
    }>
  ): [CustomError | null, CreateAttendanceDTO[] | null] {
    const attendanceDTOs: CreateAttendanceDTO[] = [];

    for (const dataItem of data) {
      // Convertir el string de fecha a un objeto Date
      const parsedDate = new Date(dataItem.date);

      // Validar los campos del registro
      const validationError = this.validateFields({
        ...dataItem,
        date: parsedDate,
      });
      if (validationError) {
        return [validationError, null]; // Retorna el error en cuanto se encuentre
      }

      // Crear el DTO validado y agregarlo al array
      attendanceDTOs.push(
        new CreateAttendanceDTO(
          dataItem.name,
          dataItem.email,
          dataItem.dni,
          dataItem.memberNumber,
          dataItem.entry,
          parsedDate
        )
      );
    }

    // Si todos los registros son válidos, devolver el array de DTOs
    return [null, attendanceDTOs];
  }

  // Método de validación de los campos del DTO
  private static validateFields(data: {
    name: string;
    email: string;
    dni: string;
    memberNumber: string;
    entry: string;
    date: Date;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.name)) {
      return CustomError.badRequest("Name is required");
    }

    if (!Validators.isValidEmail(data.email)) {
      console.log("el email:", data.email);
      return CustomError.badRequest("Invalid email format");
    }

    if (!Validators.isNotEmpty(data.dni)) {
      return CustomError.badRequest("DNI is required");
    }

    if (!Validators.isNotEmpty(data.memberNumber)) {
      return CustomError.badRequest("Member number is required");
    }

    if (!Validators.validateDateObject(data.date)) {
      console.log("es aqui", data.date);
      return CustomError.badRequest("Invalid date format");
    }

    return null;
  }
}
