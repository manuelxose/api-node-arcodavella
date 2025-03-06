import { UpdateDocumentDTO } from "../../../domain/dtos/documents";
import DocumentEntity from "../../../domain/entities/document/DocumentEntity";
import { DocumentRepository } from "../../../domain/repositories";





export class UpdateDocumentUseCase {
    constructor(private readonly documentRepository: DocumentRepository) {}
    
    async execute(updateDocumentDTO: UpdateDocumentDTO): Promise<DocumentEntity> {
        const document = await this.documentRepository.update(updateDocumentDTO);
        return document;
    }
}