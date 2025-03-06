import { GetAllDocumentByUSerIdDTO } from "../../../domain/dtos/documents";
import DocumentEntity from "../../../domain/entities/document/DocumentEntity";
import { DocumentRepository } from "../../../domain/repositories";



export class GetAllDocumentByUSerIDUseCase {

        constructor(private documentRepository: DocumentRepository) {}

        async execute(id: GetAllDocumentByUSerIdDTO): Promise<DocumentEntity[]> {
            return await this.documentRepository.getAll(id);
        }

    }

