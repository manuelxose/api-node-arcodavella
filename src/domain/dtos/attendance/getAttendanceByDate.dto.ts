import { Validators } from "../../../shared";
import { CustomError } from "../../errors";

export class GetAttendanceByDateDTO {
  constructor(public readonly date: Date) {}

  static create(data: {
    date: string;
  }): [CustomError | null, GetAttendanceByDateDTO | null] {
    // Convertir el string a un objeto Date
    const parsedDate = new Date(data.date);
    console.log(data.date, parsedDate);
    // Validar si la fecha es válida
    if (!Validators.validateDateObject(parsedDate)) {
      console.log("la fgecha parseada", parsedDate);
      return [CustomError.badRequest("Invalid date format"), null];
    }

    // Retornar el DTO con la fecha ya convertida
    return [null, new GetAttendanceByDateDTO(parsedDate)];
  }
}
