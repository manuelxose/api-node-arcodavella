import { Validators } from "../../../shared/validators";

export class SendPasswordChangedNotificationDTO {
  constructor(public readonly email: string) {}

  static create(data: {
    email: string;
  }): [Error | null, SendPasswordChangedNotificationDTO | null] {
    if (!Validators.isNotEmpty(data.email)) {
      return [new Error("Email is required"), null];
    }

    if (!Validators.isValidEmail(data.email)) {
      return [new Error("Invalid email format"), null];
    }

    return [null, new SendPasswordChangedNotificationDTO(data.email)];
  }
}
