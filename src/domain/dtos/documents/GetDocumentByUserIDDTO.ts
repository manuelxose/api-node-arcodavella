import { Validators } from "../../../shared";
import { CustomError } from "../../errors";




export class GetDocumentByUserIDDTO {
   
    public readonly userId: string;

    constructor ( userId: string) {
        this.userId = userId;
    }

    static create(data: { userId: string }): [CustomError | null, GetDocumentByUserIDDTO | null] {
        const validationError = this.validateFields(data);
        if (validationError) {
            return [validationError, null];
        }
        return [null, new GetDocumentByUserIDDTO(data.userId)];
    }

    private static validateFields(data: { userId: string }): CustomError | null {
        if (!Validators.isNotEmpty(data.userId)) {
            return CustomError.badRequest("User ID is required");
        }
        return null;
    }
}