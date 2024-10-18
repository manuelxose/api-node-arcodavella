import { MemberEntity } from "../../domain/entities/members/MemberEntity";
import { Validators } from "../../shared";
import { CustomError } from "../../domain/errors/custom.errors";

interface MemberDTO {
  id: string;
  name: string;
  email: string;
  dni: string;
  comments: string;
  memberNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MemberMapper {
  static toEntity(dto: Partial<MemberDTO>): MemberEntity {
    this.validateDTO(dto);

    return MemberEntity.create({
      id: dto.id!,
      name: dto.name!,
      email: dto.email!,
      dni: dto.dni!,
      comments: dto.comments!,
      memberNumber: dto.memberNumber!,
      createdAt: dto.createdAt!,
      updatedAt: dto.updatedAt!,
    });
  }

  static toDTO(entity: MemberEntity): MemberDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      dni: entity.dni,
      comments: entity.comments,
      memberNumber: entity.memberNumber,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private static validateDTO(dto: Partial<MemberDTO>): void {
    // Validación del ID
    if (!Validators.isNotEmpty(dto.id)) {
      throw CustomError.badRequest("Member id is required");
    }

    // Validación del nombre
    if (!Validators.isNotEmpty(dto.name)) {
      throw CustomError.badRequest("Name is required");
    }

    // Validación del email
    if (!Validators.isNotEmpty(dto.email)) {
      throw CustomError.badRequest("Email is required");
    }
    if (!Validators.isValidEmail(dto.email!)) {
      throw CustomError.badRequest("Invalid email format");
    }

    // Validación del DNI
    if (!Validators.isNotEmpty(dto.dni)) {
      throw CustomError.badRequest("DNI is required");
    }
    if (!Validators.isValidDNI(dto.dni!)) {
      // throw CustomError.badRequest("Invalid DNI format");
    }

    // Validación de los comentarios (opcional, pero si está presente, debe ser válido)
    if (dto.comments && !Validators.isValidComments(dto.comments)) {
      throw CustomError.badRequest("Comments should not exceed 200 characters");
    }

    // Validación del número de miembro
    if (!Validators.isNotEmpty(dto.memberNumber)) {
      throw CustomError.badRequest("Member number is required");
    }
    if (!Validators.isValidMemberNumber(dto.memberNumber!)) {
      // throw CustomError.badRequest("Invalid member number format");
    }

    // Validación de las fechas
    if (!dto.createdAt) {
      throw CustomError.badRequest("CreatedAt is required");
    }
    if (!dto.updatedAt) {
      throw CustomError.badRequest("UpdatedAt is required");
    }
  }
}
