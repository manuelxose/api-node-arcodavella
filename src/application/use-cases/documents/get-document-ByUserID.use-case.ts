import { GetDocumentByUserIDDTO } from "../../../domain/dtos/documents";
import DocumentEntity from "../../../domain/entities/document/DocumentEntity";
import { DocumentRepository } from "../../../domain/repositories/document.repository";

export class GetDocumentByUserIdUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}
  async execute(id: GetDocumentByUserIDDTO): Promise<DocumentEntity[]> {
    const document = await this.documentRepository.getByUserId(id);
    return document;
  }
}
