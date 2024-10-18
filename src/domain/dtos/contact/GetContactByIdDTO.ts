import { Validators } from "../../../shared";
import { CustomError } from "../../errors";

export class GetContactByIdDTO {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  static create(data: {
    id: string;
  }): [CustomError | null, GetContactByIdDTO | null] {
    const errors = this.validate(data);
    if (errors) return [errors, null];
    return [null, new GetContactByIdDTO(data.id)];
  }

  private static validate(data: { id: string }): CustomError | null {
    if (!Validators.isNotEmpty(data.id))
      return CustomError.badRequest("ID no puede estar vacío");

    return null;
  }
}
