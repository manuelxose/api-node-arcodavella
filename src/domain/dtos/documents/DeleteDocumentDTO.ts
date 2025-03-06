import { Validators } from "../../../shared";
import { CustomError } from "../../errors";



export class DeleteDocumentDTO {

    public readonly id: string;
    public readonly userId: string;
    
    private constructor(id: string, userId: string) {
        this.id = id;
        this.userId = userId;
    }

    static create(data: {
        id: string;
        userId: string;
    }): [CustomError | null, DeleteDocumentDTO | null] {
        const validationError = this.validateFields(data);
        if (validationError) {
            return [validationError, null];
        }
        return [null, new DeleteDocumentDTO(data.id, data.userId)];
    }

    private static validateFields(data: {
        id: string;
        userId: string;
    }): CustomError | null {
        if (!Validators.isNotEmpty(data.id)) {
            return CustomError.badRequest("ID is required");
        }
        if (!Validators.isNotEmpty(data.userId)) {
            return CustomError.badRequest("User ID is required");
        }
        return null;
    }

}