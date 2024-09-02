import { Validators } from "../../../shared/validators";

export class UpdateProfileDTO {
  public userId: string;
  public email?: string;
  public passwordHash?: string;

  private constructor(userId: string, email?: string, passwordHash?: string) {
    this.userId = userId;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  static create(data: {
    userId: string;
    email?: string;
    passwordHash?: string;
  }): [Error | null, UpdateProfileDTO | null] {
    if (!Validators.isNotEmpty(data.userId)) {
      return [new Error("User ID is required"), null];
    }

    if (data.email && !Validators.isValidEmail(data.email)) {
      return [new Error("Invalid email format"), null];
    }

    if (data.passwordHash && !Validators.isValidPassword(data.passwordHash)) {
      return [
        new Error(
          "Password must be at least 8 characters long and contain letters and numbers"
        ),
        null,
      ];
    }

    return [
      null,
      new UpdateProfileDTO(data.userId, data.email, data.passwordHash),
    ];
  }
}
