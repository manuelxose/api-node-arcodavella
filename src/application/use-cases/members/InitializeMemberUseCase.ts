import { InitializeMembersDTO } from "../../../domain/dtos/member/initializeMembersDTO";
import { CustomError } from "../../../domain/errors";
import { MemberRepository } from "../../../domain/repositories";
import { InitializeMembersResponse } from "../../interfaces";

export class InitializeMembersUseCase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(
    initializeMembersDTO: InitializeMembersDTO
  ): Promise<InitializeMembersResponse> {
    try {
      await this.memberRepository.initializeMembers(initializeMembersDTO);

      return {
        success: true,
        message: "Members initialized successfully",
        initializedMembersCount: initializeMembersDTO.members.length,
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internal("Failed to initialize members en el use case");
    }
  }
}
