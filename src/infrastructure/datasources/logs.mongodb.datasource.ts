import LoginLogModel, {
  ILoginLog,
} from "../../data/mongodb/models/loginlog.model";
import { LogDataSource } from "../../domain/datasources";
import { GetLogsByEmailDTO, RegisterLoginDTO } from "../../domain/dtos/logs";
import { LogsEntity } from "../../domain/entities/logs/LogsEntity";

export class MongoLogsDatasource implements LogDataSource {
  /**
   * Registra un nuevo inicio de sesión.
   * @param registerLoginDTO Datos del inicio de sesión.
   * @returns El registro de login creado.
   */
  async registerLogin(registerLoginDTO: RegisterLoginDTO): Promise<LogsEntity> {
    const loginLogDoc: ILoginLog = new LoginLogModel({
      email: registerLoginDTO.email,
      ipAddress: registerLoginDTO.ipAddress,
      timestamp: registerLoginDTO.timestamp,
    });

    const savedLog = await loginLogDoc.save();

    return {
      id: savedLog._id.toHexString(),
      email: savedLog.email,
      ipAddress: savedLog.ipAddress,
      timestamp: savedLog.timestamp,
    };
  }

  /**
   * Obtiene los registros de login por email.
   * @param dto Correo electrónico del usuario.
   * @returns Lista de registros de login.
   */
  async getLogsByEmail(dto: GetLogsByEmailDTO): Promise<LogsEntity[]> {
    const logs = await LoginLogModel.find({ email: dto.email })
      .sort({ timestamp: -1 })
      .exec();

    return logs.map((log) => ({
      id: log._id.toHexString(),
      email: log.email,
      ipAddress: log.ipAddress,
      timestamp: log.timestamp,
    }));
  }

  /**
   * Obtiene todos los registros de login.
   * @returns Lista de registros de login.
   */
  async getAll(): Promise<LogsEntity[]> {
    const logs = await LoginLogModel.find().sort({ timestamp: -1 }).exec();

    return logs.map((log) => ({
      id: log._id.toHexString(),
      email: log.email,
      ipAddress: log.ipAddress,
      timestamp: log.timestamp,
    }));
  }
}
