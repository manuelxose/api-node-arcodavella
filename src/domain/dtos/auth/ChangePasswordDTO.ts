import { Validators } from "../../../shared/validators";

export class ChangePasswordDTO {
  public token: string;
  public newPassword: string;

  private constructor(userId: string, newPassword: string) {
    this.token = userId;
    this.newPassword = newPassword;
  }

  static create(data: {
    token: string;
    newPassword: string;
  }): [Error | null, ChangePasswordDTO | null] {
    // Validar que los campos no estén vacíos
    if (
      !Validators.isNotEmpty(data.token) ||
      !Validators.isNotEmpty(data.newPassword)
    ) {
      return [
        new Error("User ID, old password, and new password are required"),
        null,
      ];
    }

    // Validar la nueva contraseña
    if (!Validators.isValidPassword(data.newPassword)) {
      return [
        new Error(
          "New password must be at least 8 characters long and contain letters and numbers"
        ),
        null,
      ];
    }

    return [null, new ChangePasswordDTO(data.token, data.newPassword)];
  }
}
