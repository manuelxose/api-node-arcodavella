import { Validators } from "../../../shared/validators";

export class SendAccountVerificationEmailDTO {
  constructor(
    public readonly email: string,
    public readonly verificationToken: string
  ) {}

  static create(data: {
    email: string;
    verificationToken: string;
  }): [Error | null, SendAccountVerificationEmailDTO | null] {
    if (
      !Validators.isNotEmpty(data.email) ||
      !Validators.isNotEmpty(data.verificationToken)
    ) {
      return [new Error("Email and verification token are required"), null];
    }

    if (!Validators.isValidEmail(data.email)) {
      return [new Error("Invalid email format"), null];
    }

    return [
      null,
      new SendAccountVerificationEmailDTO(data.email, data.verificationToken),
    ];
  }
}
