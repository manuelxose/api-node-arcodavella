import { GetLogsByEmailDTO } from "../../../domain/dtos/logs";
import { CustomError } from "../../../domain/errors";
import { LogRepository } from "../../../domain/repositories/logs.repository";

export class GetLogsByEmailUseCase {
  constructor(private logRepository: LogRepository) {}

  async execute(getLogsByEmailDTO: GetLogsByEmailDTO): Promise<any> {
    // Intentar obtener los registros de login por email
    console.log("en el caso de uso:", getLogsByEmailDTO);
    const logs = await this.logRepository.getLogsByEmail(getLogsByEmailDTO);

    if (!logs) {
      throw CustomError.notFound("No logs found");
    }

    // Devolver los registros de login
    return logs;
  }
}
