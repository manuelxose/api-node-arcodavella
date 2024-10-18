import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors/custom.errors";

export class GetActiveUserByEmailDTO {
  public email: string;

  private constructor(email: string) {
    this.email = email;
  }

  static create(data: {
    email: string | undefined;
  }): [CustomError | null, GetActiveUserByEmailDTO | null] {
    if (!data.email || !Validators.isNotEmpty(data.email)) {
      return [CustomError.badRequest("User email is required"), null];
    }

    if (!Validators.isValidEmail(data.email)) {
      return [CustomError.badRequest("Invalid email format"), null];
    }

    return [null, new GetActiveUserByEmailDTO(data.email)];
  }
}
