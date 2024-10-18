import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.errors";
import logger from "../../core/adapters/logger";
import {
  CreateMemberUseCase,
  UpdateMemberUseCase,
  DeleteMemberUseCase,
  GetMemberUseCase,
  GetAllMembersUseCase,
  InitializeMembersUseCase,
} from "../../application/use-cases/members";
import {
  CreateMemberDTO,
  UpdateMemberDTO,
  GetMemberByIdDTO,
  DeleteMemberDTO,
  InitializeMembersDTO,
} from "../../domain/dtos/member";
import { MemberMongoRepository } from "../repositories";

export class MemberController {
  private createMember: CreateMemberUseCase;
  private updateMember: UpdateMemberUseCase;
  private deleteMember: DeleteMemberUseCase;
  private getMember: GetMemberUseCase;
  private getAllMember: GetAllMembersUseCase;
  private initializeMember: InitializeMembersUseCase;

  constructor(private readonly memberRepository: MemberMongoRepository) {
    this.createMember = new CreateMemberUseCase(this.memberRepository);
    this.updateMember = new UpdateMemberUseCase(this.memberRepository);
    this.deleteMember = new DeleteMemberUseCase(this.memberRepository);
    this.getMember = new GetMemberUseCase(this.memberRepository);
    this.getAllMember = new GetAllMembersUseCase(this.memberRepository);
    this.initializeMember = new InitializeMembersUseCase(this.memberRepository);
  }

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    logger.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }

  public async create(req: Request, res: Response): Promise<Response | void> {
    const [error, createMemberDTO] = CreateMemberDTO.create(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    this.createMember
      .execute(createMemberDTO!)
      .then((response) => {
        res.status(201).send(response);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  public async update(req: Request, res: Response): Promise<Response | void> {
    const [error, updateMemberDTO] = UpdateMemberDTO.create({
      id: req.params.id,
      ...req.body,
    });
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    this.updateMember
      .execute(updateMemberDTO!)
      .then((member) => {
        res.status(200).send(member);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  public async delete(req: Request, res: Response): Promise<Response | void> {
    const id = req.params.id;
    const [error, deleteMemberDTO] = DeleteMemberDTO.create({
      id: id,
    });
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    this.deleteMember
      .execute(deleteMemberDTO!)
      .then(() => {
        res.status(200).send({ message: "Deleted succesfully" });
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  public async getById(req: Request, res: Response): Promise<Response | void> {
    const [error, getMemberByIdDTO] = GetMemberByIdDTO.create({
      id: req.params.id,
    });
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    this.getMember
      .execute(getMemberByIdDTO!)
      .then((member) => {
        if (!member) {
          return res.status(404).send({ error: "Member not found" });
        }
        res.status(200).send(member);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  public async getAll(_req: Request, res: Response): Promise<void> {
    this.getAllMember
      .execute()
      .then((members) => {
        res.status(200).send(members);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  public async initialize(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const [error, initializeMembersDTO] = InitializeMembersDTO.create({
      members: req.body,
    });
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    this.initializeMember
      .execute(initializeMembersDTO!)
      .then((response) => {
        res.status(201).send(response);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }
}
