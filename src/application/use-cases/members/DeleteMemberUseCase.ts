import { DeleteMemberDTO } from "../../../domain/dtos/member/deleteMemberDTO";
import { CustomError } from "../../../domain/errors";
import { MemberRepository } from "../../../domain/repositories";

export class DeleteMemberUseCase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(deleteMemberDTO: DeleteMemberDTO): Promise<void> {
    const member = await this.memberRepository.getMemberById(deleteMemberDTO);

    if (!member) {
      throw CustomError.notFound("Member not found");
    }

    await this.memberRepository.deleteMember(deleteMemberDTO);
  }
}
