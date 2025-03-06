// src/domain/repositories/document.repository.ts

import { DocumentDataSource } from "../../domain/datasources";
import {
  CreateDocumentDTO,
  DeleteDocumentDTO,
  GetDocumentByIdDTO,
  GetDocumentByUserIDDTO,
  UpdateDocumentDTO,
} from "../../domain/dtos/documents";
import DocumentEntity from "../../domain/entities/document/DocumentEntity";
import { DocumentRepository } from "../../domain/repositories";

class DocumentMongoRepository implements DocumentRepository {
  constructor(private readonly dataSource: DocumentDataSource) {}

  async create(documentDTO: CreateDocumentDTO): Promise<DocumentEntity> {
    return this.dataSource.create(documentDTO);
  }

  async delete(documentDTO: DeleteDocumentDTO): Promise<void> {
    return this.dataSource.delete(documentDTO);
  }

  async getAll(): Promise<DocumentEntity[]> {
    return this.dataSource.getAll();
  }

  async getById(
    documentDTO: GetDocumentByIdDTO
  ): Promise<DocumentEntity | null> {
    return this.dataSource.getById(documentDTO);
  }

  async update(documentDTO: UpdateDocumentDTO): Promise<DocumentEntity> {
    return this.dataSource.update(documentDTO);
  }

  async getByUserId(id: GetDocumentByUserIDDTO): Promise<DocumentEntity[]> {
    return this.dataSource.getByUserId(id);
  }
}

export { DocumentMongoRepository as DocumentRepository };
// src/infrastructure/repositories/document.repository.ts
