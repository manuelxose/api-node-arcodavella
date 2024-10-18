import {
  CreateMemberDTO,
  UpdateMemberDTO,
  GetMemberByIdDTO,
  DeleteMemberDTO,
  InitializeMembersDTO,
  GetMemberByEmailDTO,
} from "../../domain/dtos/member";
import { MemberEntity } from "../../domain/entities/members/MemberEntity";
import { MemberRepository } from "../../domain/repositories";
import { MemberDataSource } from "../../domain/datasources";

export class MemberMongoRepository implements MemberRepository {
  constructor(private readonly dataSource: MemberDataSource) {}

  createMember(createMemberDTO: CreateMemberDTO): Promise<MemberEntity> {
    return this.dataSource.createMember(createMemberDTO);
  }

  updateMember(updateMemberDTO: UpdateMemberDTO): Promise<MemberEntity> {
    return this.dataSource.updateMember(updateMemberDTO);
  }

  deleteMember(deleteMemberDTO: DeleteMemberDTO): Promise<void> {
    return this.dataSource.deleteMember(deleteMemberDTO);
  }

  getMemberById(getMemberDTO: GetMemberByIdDTO): Promise<MemberEntity> {
    return this.dataSource.getMemberById(getMemberDTO);
  }

  getAllMembers(): Promise<MemberEntity[]> {
    return this.dataSource.getAllMembers();
  }

  initializeMembers(initializeMembersDTO: InitializeMembersDTO): Promise<void> {
    return this.dataSource.initializeMembers(initializeMembersDTO);
  }
  getMemberByEmail(
    getMemeberByEmailDTO: GetMemberByEmailDTO
  ): Promise<MemberEntity> {
    return this.dataSource.getMemberByEmail(getMemeberByEmailDTO);
  }
}
