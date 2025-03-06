import { CreateDocumentDTO } from "../../../domain/dtos/documents";
import { CustomError } from "../../../domain/errors";
import { DocumentRepository } from "../../../domain/repositories";


interface CreateDocumentResponse {  
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}



export class CreateDocumentUseCase {
    constructor(private documentRepository: DocumentRepository) {}
    
    async execute(
        createDocumentDTO: CreateDocumentDTO
    ): Promise<CreateDocumentResponse> {
        const response = await this.documentRepository.create(createDocumentDTO);
    
        if (!response) {
        throw CustomError.badRequest("Error creating document");
        }
    
        return {
        title: response.title,
        content: response.description,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        };
    }
    }