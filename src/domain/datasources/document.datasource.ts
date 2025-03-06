import { CreateDocumentDTO, DeleteDocumentDTO, GetDocumentByIdDTO, GetDocumentByUserIDDTO, UpdateDocumentDTO } from "../dtos/documents";
import DocumentEntity from "../entities/document/DocumentEntity";

export abstract class DocumentDataSource {
  abstract getAll(): Promise<DocumentEntity[]>;
  abstract getById(id: GetDocumentByIdDTO): Promise<DocumentEntity | null>;
  abstract create(document: CreateDocumentDTO): Promise<DocumentEntity>;
  abstract update(document: UpdateDocumentDTO): Promise<DocumentEntity>;
  abstract delete(id: DeleteDocumentDTO): Promise<void>;
  abstract getByUserId(id: GetDocumentByUserIDDTO): Promise<DocumentEntity[]>;
}
