import { Validators } from "../../../shared/validators";

export class SendPasswordResetEmailDTO {
  constructor(
    public readonly email: string,
    public readonly resetToken: string
  ) {}

  static create(data: {
    email: string;
    resetToken: string;
  }): [Error | null, SendPasswordResetEmailDTO | null] {
    if (
      !Validators.isNotEmpty(data.email) ||
      !Validators.isNotEmpty(data.resetToken)
    ) {
      return [new Error("Email and reset token are required"), null];
    }

    if (!Validators.isValidEmail(data.email)) {
      return [new Error("Invalid email format"), null];
    }

    return [null, new SendPasswordResetEmailDTO(data.email, data.resetToken)];
  }
}
