import { UpdateAttendanceDTO } from "../../../domain/dtos/attendance";
import { CustomError } from "../../../domain/errors";
import { AttendanceRepository } from "../../../domain/repositories";

// Interfaz para la respuesta del caso de uso
interface UpdateAttendanceResponse {
  name: string;
  email: string;
  memberNumber: string;
  date: Date;
}

export class UpdateAttendanceUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(
    updateAttendanceDTO: UpdateAttendanceDTO
  ): Promise<UpdateAttendanceResponse> {
    const attendance = await this.attendanceRepository.updateAttendance(
      updateAttendanceDTO
    );

    if (!attendance) {
      throw CustomError.badRequest("Error updating attendance");
    }

    return {
      name: attendance.name,
      email: attendance.email,
      memberNumber: attendance.memberNumber,
      date: attendance.date,
    };
  }
}
