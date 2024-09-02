import { Validators } from "../../../shared/validators";

export class LoginUserDTO {
  public email: string;
  public password: string;

  private constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  static create(data: {
    email: string;
    password: string;
  }): [Error | null, LoginUserDTO | null] {
    if (
      !Validators.isNotEmpty(data.email) ||
      !Validators.isNotEmpty(data.password)
    ) {
      return [new Error("Email and password are required"), null];
    }

    if (!Validators.isValidEmail(data.email)) {
      return [new Error("Invalid email format"), null];
    }

    if (!Validators.isValidPassword(data.password)) {
      return [
        new Error(
          "Password must be at least 8 characters long and contain letters and numbers"
        ),
        null,
      ];
    }

    return [null, new LoginUserDTO(data.email, data.password)];
  }
}
