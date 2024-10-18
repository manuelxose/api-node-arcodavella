import { Validators } from "../../shared";
import { CustomError } from "../../domain/errors/custom.errors";
import { AttendanceEntity } from "../../domain/entities/attendance/attendance.entity";

interface AttendanceDTO {
  id: string;
  name: string;
  email: string;
  dni: string;
  memberNumber: string;
  date: Date;
  entry: string;
}

export class AttendanceMapper {
  // Convierte un DTO en una entidad de dominio
  static toEntity(dto: Partial<AttendanceDTO>): AttendanceEntity {
    // Llamada a la validación correctamente referenciada
    AttendanceMapper.validateDTO(dto);

    return AttendanceEntity.create({
      id: dto.id!,
      name: dto.name!,
      email: dto.email!,
      dni: dto.dni!,
      memberNumber: dto.memberNumber!,
      date: dto.date!,
      entry: dto.entry!,
    });
  }

  // Convierte una entidad de dominio en un DTO
  static toDTO(entity: AttendanceEntity): AttendanceDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      dni: entity.dni,
      memberNumber: entity.memberNumber,
      date: entity.date,
      entry: entity.entry,
    };
  }

  // Valida los datos del DTO
  private static validateDTO(dto: Partial<AttendanceDTO>): void {
    // Validación del ID
    if (!Validators.isNotEmpty(dto.id)) {
      throw CustomError.badRequest("Attendance id is required");
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
    // if (!Validators.isValidDNI(dto.dni!)) {
    //   throw CustomError.badRequest("Invalid DNI format");
    // }

    // Validación del número de miembro
    if (!Validators.isNotEmpty(dto.memberNumber)) {
      throw CustomError.badRequest("Member number is required");
    }
    if (!Validators.isValidMemberNumber(dto.memberNumber!)) {
      throw CustomError.badRequest("Invalid member number format");
    }

    // Validación de la fecha de asistencia
    if (!Validators.validateDateObject(dto.date!)) {
      throw CustomError.badRequest("Invalid date format");
    }
  }
}
