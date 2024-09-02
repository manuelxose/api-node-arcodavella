import { Validators } from "../../../shared/validators";

export class GetActiveUserByEmailDTO {
  public email: string;

  private constructor(email: string) {
    this.email = email;
  }

  static create(data: {
    email: string;
  }): [Error | null, GetActiveUserByEmailDTO | null] {
    if (!Validators.isNotEmpty(data.email)) {
      return [new Error("User email is required"), null];
    }

    if (!Validators.isValidEmail(data.email)) {
      return [new Error("Invalid email format"), null];
    }

    return [null, new GetActiveUserByEmailDTO(data.email)];
  }
}
