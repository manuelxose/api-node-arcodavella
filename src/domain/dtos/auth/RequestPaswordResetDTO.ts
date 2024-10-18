import { Validators } from "../../../shared/validators";
import { CustomError } from "../../../domain/errors/custom.errors";

export class RequestPasswordResetDTO {
  public email: string;

  private constructor(email: string) {
    this.email = email;
  }

  static create(data: {
    email: string;
  }): [CustomError | null, RequestPasswordResetDTO | null] {
    console.log(data);

    if (typeof data.email !== "string") {
      return [CustomError.badRequest("Email must be a string"), null];
    }

    const email = data.email.trim(); // Asegura que no haya espacios en blanco alrededor del correo

    if (!Validators.isNotEmpty(email)) {
      return [CustomError.badRequest("Email is required"), null];
    }

    if (!Validators.isValidEmail(email)) {
      return [CustomError.badRequest("Invalid email format"), null];
    }

    return [null, new RequestPasswordResetDTO(email)];
  }
}
