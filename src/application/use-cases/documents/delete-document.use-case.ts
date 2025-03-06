import { DeleteDocumentDTO } from "../../../domain/dtos/documents";
import { CustomError } from "../../../domain/errors";
import { DocumentRepository } from "../../../domain/repositories";


// interface DeleteDocumentResponse {  
//     title: string;
//     content: string;
//     createdAt: Date;
//     updatedAt: Date;
// }




export class DeleteDocumentUseCase {
    constructor(private documentRepository: DocumentRepository) {}
    
    async execute(
        id: DeleteDocumentDTO
    ): Promise<void> {
        const document = await this.documentRepository.getById(id);

        if (!document) {
            throw CustomError.notFound("Document not found");
        }  
        await this.documentRepository.delete(id);

    }

}