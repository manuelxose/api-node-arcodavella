import { Validators } from "../../../shared/validators";

export class UpdatePasswordDTO {
  constructor(
    public readonly userId: string,
    public readonly newPassword: string
  ) {}

  static create(data: {
    userId: string;
    newPassword: string;
  }): [Error | null, UpdatePasswordDTO | null] {
    if (!Validators.isNotEmpty(data.userId)) {
      return [new Error("User ID is required"), null];
    }

    if (!Validators.isValidPassword(data.newPassword)) {
      return [
        new Error(
          "Password must be at least 8 characters long and meet security criteria"
        ),
        null,
      ];
    }

    return [null, new UpdatePasswordDTO(data.userId, data.newPassword)];
  }
}
