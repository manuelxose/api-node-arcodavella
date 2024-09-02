import { Validators } from "../../../shared/validators";

export class GetActiveUserDTO {
  public userId: string;

  private constructor(userId: string) {
    this.userId = userId;
  }

  static create(data: {
    userId: string;
  }): [Error | null, GetActiveUserDTO | null] {
    // Validar que el campo userId no esté vacío
    if (!Validators.isNotEmpty(data.userId)) {
      return [new Error("User ID is required"), null];
    }

    // Si todo es válido, retornar el DTO
    return [null, new GetActiveUserDTO(data.userId)];
  }
}
