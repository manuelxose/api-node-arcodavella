import { GetMemberByIdDTO } from "../../../domain/dtos/member/getMeberByIdDTO";
import { CustomError } from "../../../domain/errors";
import { MemberRepository } from "../../../domain/repositories";
import { GetMemberResponse } from "../../interfaces";

export class GetMemberUseCase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(getMemberDTO: GetMemberByIdDTO): Promise<GetMemberResponse> {
    const member = await this.memberRepository.getMemberById(getMemberDTO);

    if (!member) {
      throw CustomError.notFound("Member not found");
    }

    return member;
  }
}
