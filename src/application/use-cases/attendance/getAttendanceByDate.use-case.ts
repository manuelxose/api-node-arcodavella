import { GetAttendanceByDateDTO } from "../../../domain/dtos/attendance";
import { CustomError } from "../../../domain/errors";
import { AttendanceRepository } from "../../../domain/repositories";

// Interfaz para la respuesta del caso de uso
interface GetAttendanceByDateResponse {
  name: string;
  email: string;
  memberNumber: string;
  dni: string;
  id: string;
  entry: string;
}

export class GetAttendanceByDateUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(
    getAttendanceByDateDTO: GetAttendanceByDateDTO
  ): Promise<GetAttendanceByDateResponse[]> {
    const attendances = await this.attendanceRepository.getAttendancesByDate(
      getAttendanceByDateDTO
    );

    if (!attendances || attendances.length === 0) {
      throw CustomError.notFound("No attendances found for the given date");
    }

    return attendances.map((attendance) => ({
      name: attendance.name,
      email: attendance.email,
      memberNumber: attendance.memberNumber,
      dni: attendance.dni,
      id: attendance.id,
      entry: attendance.entry,
    }));
  }
}
