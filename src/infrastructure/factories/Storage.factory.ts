// src/infrastructure/factories/DocumentRepositoryFactory.ts

import { StorageProviderType } from "../../domain/enums";
import { GoogleDriveDataSource } from "../datasources/googleDrive.datasource";
import { StorageRepository } from "../repositories";

export class StorageRepositoryFactory {
  static create(): StorageRepository {
    switch (process.env.STORAGE_PROVIDER) {
      case StorageProviderType.GOOGLE_DRIVE:
        return new StorageRepository(new GoogleDriveDataSource());
      case StorageProviderType.AWS_S3:
      default:
        throw new Error("Invalid storage provider");
    }
  }
}
