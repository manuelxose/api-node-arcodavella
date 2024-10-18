import { DeleteAttendanceDTO } from "../../../domain/dtos/attendance";
import { AttendanceRepository } from "../../../domain/repositories";

// Interfaz para la respuesta del caso de uso
interface DeleteAttendanceByDateResponse {
  message: string;
}

export class DeleteAttendanceByDateUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(
    deleteAttendanceDTO: DeleteAttendanceDTO
  ): Promise<DeleteAttendanceByDateResponse> {
    await this.attendanceRepository.deleteAttendancesByDate(
      deleteAttendanceDTO
    );

    return {
      message: "Attendances deleted successfully",
    };
  }
}
