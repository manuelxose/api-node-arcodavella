export class LogsEntity {
  public readonly id: string;
  public readonly email: string;
  public readonly ipAddress: string;
  public readonly timestamp: Date;

  private constructor(data: {
    id: string;
    email: string;
    ipAddress: string;
    timestamp: Date;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.ipAddress = data.ipAddress;
    this.timestamp = data.timestamp;
  }

  /**
   * Crea una instancia de LoginLog.
   * @param data Datos del registro de login.
   * @returns Instancia de LoginLog.
   */
  static create(data: {
    id: string;
    email: string;
    ipAddress: string;
    timestamp: Date;
  }): LogsEntity {
    return new LogsEntity(data);
  }
}
