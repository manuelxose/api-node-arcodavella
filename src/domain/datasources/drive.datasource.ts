export abstract class DriveDataSource {
  //TODO: Definir los métodos abstractos para la fuente de datos de Google Drive

  abstract createFile(data: {
    name: string;
    mimeType: string;
    webViewLink?: string;
    webContentLink?: string;
  }): Promise<void>;
  abstract deleteFile(data: { id: string }): Promise<void>;
  abstract getFile(data: { id: string }): Promise<void>;
  abstract getFiles(data: { id: string }): Promise<void>;
}
