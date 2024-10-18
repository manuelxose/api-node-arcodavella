import { MemberEntity } from "../../entities/members/MemberEntity";
import { CustomError } from "../../errors";
import { CreateMemberDTO } from "./createMemberDTO";

export class InitializeMembersDTO {
  constructor(public readonly members: CreateMemberDTO[]) {}

  static create(data: {
    members: MemberEntity[];
  }): [CustomError | null, InitializeMembersDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }

    const members: CreateMemberDTO[] = [];
    for (const memberData of data.members) {
      const [error, createMemberDTO] = CreateMemberDTO.create(memberData);
      if (error) {
        return [error, null];
      }
      members.push(createMemberDTO!);
    }

    return [null, new InitializeMembersDTO(members)];
  }

  private static validateFields(data: {
    members: MemberEntity[];
  }): CustomError | null {
    if (!Array.isArray(data.members) || data.members.length === 0) {
      return CustomError.badRequest(
        "Members array is required and cannot be empty"
      );
    }

    return null;
  }
}
