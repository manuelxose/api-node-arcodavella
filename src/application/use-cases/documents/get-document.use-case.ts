import DocumentEntity from "../../../domain/entities/document/DocumentEntity";
import { DocumentRepository } from "../../../domain/repositories/document.repository";

export class GetDocumentByUserIdUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}
  async execute(id: string): Promise<DocumentEntity> {
    const document = await this.documentRepository.getById(id);
    return document;
  }
}
