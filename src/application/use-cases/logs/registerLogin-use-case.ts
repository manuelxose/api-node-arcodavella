import { RegisterLoginDTO } from "../../../domain/dtos/logs";
import { LogRepository } from "../../../domain/repositories/logs.repository";

export interface RegisterLoginResponse {
  email: string;
  ipAddress: string;
  timestamp: Date;
}

export class RegisterLoginUseCase {
  constructor(private loginLogRepository: LogRepository) {}

  /**
   * Registra un nuevo inicio de sesión y devuelve el número total de inicios de sesión del usuario.
   * @param data Datos del inicio de sesión.
   * @returns Número total de inicios de sesión del usuario.
   */
  async execute(data: RegisterLoginDTO): Promise<RegisterLoginResponse> {
    // añadir los elementos de try catch
    try {
      console.log("Registrando el inicio de sesión:", data);
      await this.loginLogRepository.registerLogin(data);

      return {
        email: data.email,
        ipAddress: data.ipAddress,
        timestamp: data.timestamp,
      };
    } catch (error) {
      console.log("Error al registrar el inicio de sesión:", error);
      throw error;
    }
  }
}
