import { MemberEntity } from "../entities/members/MemberEntity";
import {
  CreateMemberDTO,
  UpdateMemberDTO,
  GetMemberByIdDTO,
  DeleteMemberDTO,
  InitializeMembersDTO,
  GetMemberByEmailDTO,
} from "../dtos/member";

export abstract class MemberRepository {
  abstract createMember(
    createMemberDTO: CreateMemberDTO
  ): Promise<MemberEntity>;
  abstract updateMember(
    updateMemberDTO: UpdateMemberDTO
  ): Promise<MemberEntity>;
  abstract deleteMember(deleteMemberDTO: DeleteMemberDTO): Promise<void>;
  abstract getMemberById(
    getMemberDTO: GetMemberByIdDTO
  ): Promise<MemberEntity | null>;
  abstract getAllMembers(): Promise<MemberEntity[]>;
  abstract initializeMembers(
    initializeMembersDTO: InitializeMembersDTO
  ): Promise<void>;

  abstract getMemberByEmail(
    getMemeberByEmailDTO: GetMemberByEmailDTO
  ): Promise<MemberEntity>;
}
