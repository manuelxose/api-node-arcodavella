import { MemberRepository } from "../../../domain/repositories";
import { GetAllMembersResponse } from "../../interfaces";

export class GetAllMembersUseCase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(): Promise<GetAllMembersResponse> {
    const members = await this.memberRepository.getAllMembers();

    return {
      members: members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        dni: member.dni,
        comments: member.comments,
        memberNumber: member.memberNumber,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      })),
    };
  }
}
