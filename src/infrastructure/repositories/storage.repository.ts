import { StorageDataSource } from "../../domain/datasources";
import { StorageRepository } from "../../domain/repositories";

class StorageRepositoryImp implements StorageRepository {
  constructor(private readonly dataSource: StorageDataSource) {
    this.dataSource = dataSource;
  }

  async deleteFile(file: string): Promise<void> {
    return this.dataSource.deleteFile(file);
  }

  async getFile(file: string): Promise<Buffer> {
    return this.dataSource.getFile(file);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return this.dataSource.uploadFile(file);
  }
}

//export as StorageRepository;

export { StorageRepositoryImp as StorageRepository };
