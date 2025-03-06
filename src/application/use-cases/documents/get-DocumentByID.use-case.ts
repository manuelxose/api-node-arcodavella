import { GetDocumentByIdDTO } from "../../../domain/dtos/documents";
import DocumentEntity from "../../../domain/entities/document/DocumentEntity";
import { DocumentRepository } from "../../../domain/repositories";




export class GetDocumentByIDUseCase {   
    constructor(private documentRepository: DocumentRepository) {}

    async execute(id: GetDocumentByIdDTO): Promise<DocumentEntity | null> {
        return await this.documentRepository.getById(id);
    }
}