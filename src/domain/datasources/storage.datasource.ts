export abstract class StorageDataSource {
  abstract uploadFile(file: Express.Multer.File): Promise<string>;
  abstract deleteFile(file: string): Promise<void>;
  abstract getFile(file: string): Promise<Buffer>;
}
