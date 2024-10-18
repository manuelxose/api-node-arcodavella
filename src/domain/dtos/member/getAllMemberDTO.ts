import { Validators } from "../../../shared/validators";
import { CustomError } from "../../errors";

export class GetAllMembersDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly memberNumber: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id: string;
    name: string;
    email: string;
    memberNumber: string;
    createdAt: Date;
    updatedAt: Date;
  }): [CustomError | null, GetAllMembersDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    return [
      null,
      new GetAllMembersDTO(
        data.id,
        data.name,
        data.email,
        data.memberNumber,
        data.createdAt,
        data.updatedAt
      ),
    ];
  }

  private static validateFields(data: {
    id: string;
    name: string;
    email: string;
    memberNumber: string;
    createdAt: Date;
    updatedAt: Date;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.id))
      return CustomError.badRequest("ID is required");
    if (!Validators.isNotEmpty(data.name))
      return CustomError.badRequest("Name is required");
    if (!Validators.isNotEmpty(data.email))
      return CustomError.badRequest("Email is required");
    if (!Validators.isNotEmpty(data.memberNumber))
      return CustomError.badRequest("Member number is required");
    if (!data.createdAt)
      return CustomError.badRequest("CreatedAt date is required");
    if (!data.updatedAt)
      return CustomError.badRequest("UpdatedAt date is required");

    return null;
  }
}
