import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors";

export class DeleteMemberDTO {
  constructor(public readonly id: string) {}

  static create(data: {
    id: string;
  }): [CustomError | null, DeleteMemberDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [null, new DeleteMemberDTO(data.id)];
  }

  private static validateFields(data: { id: string }): CustomError | null {
    if (!Validators.isNotEmpty(data.id)) {
      return CustomError.badRequest("ID is required");
    }

    return null;
  }
}
