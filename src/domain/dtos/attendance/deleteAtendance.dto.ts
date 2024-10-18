import { Validators } from "../../../shared";
import { CustomError } from "../../errors";

export class DeleteAttendanceDTO {
  constructor(public readonly date: Date) {}

  static create(data: {
    date: Date;
  }): [CustomError | null, DeleteAttendanceDTO | null] {
    if (!Validators.isValidDate(data.date)) {
      return [CustomError.badRequest("Invalid date format"), null];
    }

    return [null, new DeleteAttendanceDTO(data.date)];
  }
}
