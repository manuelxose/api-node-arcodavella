import { Validators } from "../../../shared/validators";

export class LogoutUserDTO {
  public token: string;

  private constructor(token: string) {
    this.token = token;
  }

  static create(data: { token: string }): [Error | null, LogoutUserDTO | null] {
    if (!Validators.isNotEmpty(data.token)) {
      return [new Error("Token is required"), null];
    }

    return [null, new LogoutUserDTO(data.token)];
  }
}
