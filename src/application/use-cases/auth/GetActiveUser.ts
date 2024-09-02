import { GetActiveUserDTO } from "../../../domain/dtos/auth";
import { UserEntity } from "../../../domain/entities/auth";
import { AuthRepository } from "../../../domain/repositories";

export class GetActiveUser {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(
    getActiveUserDTO: GetActiveUserDTO
  ): Promise<UserEntity | null> {
    const { userId } = getActiveUserDTO;

    try {
      const user = await this.authRepository.getActiveUser(getActiveUserDTO);
      if (user && user.role !== undefined) {
        // Verifica que el usuario tiene un rol definido (indicador de que está activo)
        return user;
      } else {
        return null; // Si el usuario no tiene un rol, se asume que no está activo o no existe
      }
    } catch (error) {
      console.error("Error executing GetActiveUser:", error);
      return null;
    }
  }
}
