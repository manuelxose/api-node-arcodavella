import { Validators } from "../../../shared";

export class GetUserByIdDTO {
  public userId: string;

  private constructor(userId: string) {
    this.userId = userId;
  }

  static create(data: {
    userId: string;
  }): [Error | null, GetUserByIdDTO | null] {
    if (!Validators.isNotEmpty(data.userId)) {
      return [new Error("User ID is required."), null];
    }
    return [null, new GetUserByIdDTO(data.userId)];
  }
}
