import { Validators } from "../../../shared";
import { CustomError } from "../../errors";



export class GetDocumentByIdDTO {
    
    public readonly id: string;

    private constructor(id: string) {
        this.id = id;
    }

    static create(data: {
        id: string; 
    }):[CustomError | null, GetDocumentByIdDTO | null] {
        const validationError = this.validateFields(data);
        if (validationError) {
            return [validationError, null];
        }
        return [null, new GetDocumentByIdDTO(data.id)];
    }

    private static validateFields(data: {
        id: string;
    }): CustomError | null {
        if (!Validators.isNotEmpty(data.id)) {
            return CustomError.badRequest("ID is required");
        }
        return null;
    }
}