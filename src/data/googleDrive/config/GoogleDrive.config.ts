import { google, drive_v3 } from "googleapis";

export interface GoogleDriveOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

export class GoogleDriveConnection {
  private driveClient?: drive_v3.Drive;
  private oauth2Client?: InstanceType<typeof google.auth.OAuth2>;

  /**
   * Establece la conexión con Google Drive usando las credenciales proporcionadas.
   */
  public async connect(options: GoogleDriveOptions): Promise<void> {
    const { clientId, clientSecret, redirectUri, refreshToken } = options;

    try {
      // Inicializar el cliente OAuth2 con las credenciales
      this.oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });

      // Instanciar el cliente de Google Drive
      this.driveClient = google.drive({
        version: "v3",
        auth: this.oauth2Client,
      });

      // Operación de prueba: listar archivos para confirmar la conexión
      const res = await this.driveClient.files.list({ pageSize: 1 });
      console.log("Conectado a Google Drive:", res.data);
    } catch (error) {
      console.error("Error conectando a Google Drive:", error);
      throw error; // Propaga el error para que lo maneje el llamador
    }
  }

  /**
   * Retorna la instancia de Google Drive para realizar operaciones.
   * Lanza un error si aún no se ha establecido la conexión.
   */
  public getDriveInstance(): drive_v3.Drive {
    if (!this.driveClient) {
      throw new Error(
        "Google Drive no está conectado. Ejecuta connect() primero."
      );
    }
    return this.driveClient;
  }

  /**
   * Revoca las credenciales y limpia las instancias para "desconectar" la sesión.
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.oauth2Client) {
        await this.oauth2Client.revokeCredentials();
        console.log("Desconectado de Google Drive");
      }
      // Limpiar las referencias internas
      this.driveClient = undefined;
      this.oauth2Client = undefined;
    } catch (error) {
      console.error("Error desconectando de Google Drive:", error);
      throw error;
    }
  }
}
