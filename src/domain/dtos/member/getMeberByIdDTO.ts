import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors";

export class GetMemberByIdDTO {
  constructor(public readonly id: string) {}

  static create(data: {
    id: string;
  }): [CustomError | null, GetMemberByIdDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [null, new GetMemberByIdDTO(data.id)];
  }

  private static validateFields(data: { id: string }): CustomError | null {
    if (!Validators.isNotEmpty(data.id)) {
      return CustomError.badRequest("ID is required");
    }

    return null;
  }
}
