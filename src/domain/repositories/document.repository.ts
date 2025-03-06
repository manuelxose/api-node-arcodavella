import {
  CreateDocumentDTO,
  DeleteDocumentDTO,
  GetDocumentByIdDTO,
  GetDocumentByUserIDDTO,
  UpdateDocumentDTO,
} from "../dtos/documents";
import DocumentEntity from "../entities/document/DocumentEntity";

export interface DocumentRepository {
  getAll(userID: GetDocumentByUserIDDTO): Promise<DocumentEntity[]>;
  getById(id: GetDocumentByIdDTO): Promise<DocumentEntity | null>;
  getByUserId(id: GetDocumentByUserIDDTO): Promise<DocumentEntity[]>;
  create(document: CreateDocumentDTO): Promise<DocumentEntity>;
  update(document: UpdateDocumentDTO): Promise<DocumentEntity>;
  delete(id: DeleteDocumentDTO): Promise<void>;
}
