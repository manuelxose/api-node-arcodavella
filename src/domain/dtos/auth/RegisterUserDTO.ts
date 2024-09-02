import { UserRoles } from "../../enums/UserRoles";
import { Validators } from "../../../shared/validators";

export class RegisterUserDTO {
  public email: string;
  public password: string;
  public role: UserRoles;

  private constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.role = UserRoles.Admin; // El rol siempre se asigna como Admin
  }

  static create(data: any): [Error | null, RegisterUserDTO | null] {
    const { email, password } = data;

    if (!email || !Validators.isValidEmail(email)) {
      return [new Error("Invalid email format"), null];
    }

    if (!password || !Validators.isValidPassword(password)) {
      return [new Error("Password must be at least 8 characters long"), null];
    }

    return [null, new RegisterUserDTO(email, password)];
  }
}
