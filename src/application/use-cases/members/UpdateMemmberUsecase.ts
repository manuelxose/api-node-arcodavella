import { UpdateMemberDTO } from "../../../domain/dtos/member/updateMemberDTO";
import { CustomError } from "../../../domain/errors";
import { MemberRepository } from "../../../domain/repositories";
import { UpdateMemberResponse } from "../../interfaces";

export class UpdateMemberUseCase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(
    updateMemberDTO: UpdateMemberDTO
  ): Promise<UpdateMemberResponse> {
    const response = await this.memberRepository.updateMember(updateMemberDTO);

    if (!response) {
      throw CustomError.badRequest("Error updating member");
    }

    return {
      id: response.id,
      name: response.name,
      email: response.email,
      memberNumber: response.memberNumber,
      updatedAt: response.updatedAt,
    };
  }
}
