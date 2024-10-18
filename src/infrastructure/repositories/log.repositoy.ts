import { LogDataSource } from "../../domain/datasources/log.datasource";
import { GetLogsByEmailDTO, RegisterLoginDTO } from "../../domain/dtos/logs";
import { LogsEntity } from "../../domain/entities/logs/LogsEntity";

export class LogRepository implements LogRepository {
  constructor(private logDataSource: LogDataSource) {}

  async registerLogin(registerLoginDTO: RegisterLoginDTO): Promise<LogsEntity> {
    return this.logDataSource.registerLogin(registerLoginDTO);
  }

  async getLogsByEmail(dto: GetLogsByEmailDTO): Promise<LogsEntity[]> {
    return this.logDataSource.getLogsByEmail(dto);
  }

  async getAll(): Promise<LogsEntity[]> {
    return this.logDataSource.getAll();
  }
}
