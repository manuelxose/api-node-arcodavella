import {
  CreateMemberDTO,
  UpdateMemberDTO,
  GetMemberByIdDTO,
  DeleteMemberDTO,
  InitializeMembersDTO,
  GetMemberByEmailDTO,
} from "../dtos/member";
import { MemberEntity } from "../entities/members/MemberEntity";

export abstract class MemberDataSource {
  abstract createMember(
    createMemberDTO: CreateMemberDTO
  ): Promise<MemberEntity>;
  abstract updateMember(
    updateMemberDTO: UpdateMemberDTO
  ): Promise<MemberEntity>;
  abstract deleteMember(deleteMemberDTO: DeleteMemberDTO): Promise<void>;
  abstract getMemberById(getMemberDTO: GetMemberByIdDTO): Promise<MemberEntity>;
  abstract getAllMembers(): Promise<MemberEntity[]>;
  abstract initializeMembers(
    initializeMembersDTO: InitializeMembersDTO
  ): Promise<void>;

  abstract getMemberByEmail(
    getMemeberByEmailDTO: GetMemberByEmailDTO
  ): Promise<MemberEntity>;
}
