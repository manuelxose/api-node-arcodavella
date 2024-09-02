import { Validators } from "../../../shared/validators";

export class RequestPasswordResetDTO {
  public email: string;

  private constructor(email: string) {
    this.email = email;
  }

  static create(data: {
    email: string;
  }): [Error | null, RequestPasswordResetDTO | null] {
    if (!Validators.isNotEmpty(data.email)) {
      return [new Error("Email is required"), null];
    }

    if (!Validators.isValidEmail(data.email)) {
      return [new Error("Invalid email format"), null];
    }

    return [null, new RequestPasswordResetDTO(data.email)];
  }
}
