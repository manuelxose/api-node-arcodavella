import { Validators } from "../../../shared/validators";

export class ResetPasswordDTO {
  constructor(
    public readonly token: string,
    public readonly newPassword: string
  ) {}

  static create(data: {
    token: string;
    newPassword: string;
  }): [Error | null, ResetPasswordDTO | null] {
    if (!Validators.isNotEmpty(data.token)) {
      return [new Error("Token is required"), null];
    }

    if (!Validators.isValidPassword(data.newPassword)) {
      return [
        new Error(
          "Password must be at least 8 characters long and meet security criteria"
        ),
        null,
      ];
    }

    return [null, new ResetPasswordDTO(data.token, data.newPassword)];
  }
}
