// src/domain/repositories/LogRepository.ts

import { GetLogsByEmailDTO, RegisterLoginDTO } from "../dtos/logs";
import { LogsEntity } from "../entities/logs/LogsEntity";

export abstract class LogRepository {
  /**
   * Registra un nuevo inicio de sesión.
   * @param registerLoginDTO Datos del inicio de sesión.
   * @returns El registro de login creado.
   */
  abstract registerLogin(
    registerLoginDTO: RegisterLoginDTO
  ): Promise<LogsEntity>;

  /**
   * Obtiene los registros de login por email.
   * @param email Correo electrónico del usuario.
   * @returns Lista de registros de login.
   */
  abstract getLogsByEmail(dto: GetLogsByEmailDTO): Promise<LogsEntity[]>;

  /**
   * Obtiene todos los registros de login.
   * @returns Lista de registros de login.
   */

  abstract getAll(): Promise<LogsEntity[]>;
}
