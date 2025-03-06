import { CustomError } from "../../errors";




export class GetAllDocumentByUSerIdDTO {
 

    public readonly userId: string;

    constructor ( userId: string) {
        this.userId = userId;
    }

    static create(data: { userId: string }): [CustomError | null, GetAllDocumentByUSerIdDTO | null] {
        const validationError = this.validateFields(data);
        if (validationError) {
            return [validationError, null];
        }
        return [null, new GetAllDocumentByUSerIdDTO(data.userId)];
    }

    private static validateFields(data: { userId: string }): CustomError | null {
        if (!data.userId) {
            return CustomError.badRequest("User ID is required");
        }
        return null;
    }
}