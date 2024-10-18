import { CreateMemberDTO } from "../../../domain/dtos/member/createMemberDTO";
import { CustomError } from "../../../domain/errors";
import { MemberRepository } from "../../../domain/repositories";
import { CreateMemberResponse } from "../../interfaces";

export class CreateMemberUseCase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(
    createMemberDTO: CreateMemberDTO
  ): Promise<CreateMemberResponse> {
    const response = await this.memberRepository.createMember(createMemberDTO);

    if (!response) {
      throw CustomError.badRequest("Error creating member");
    }

    return {
      name: response.name,
      email: response.email,
      memberNumber: response.memberNumber,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }
}
