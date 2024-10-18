import { CustomError } from "../../../domain/errors";
import { AttendanceRepository } from "../../../domain/repositories";

// Interfaz para la respuesta del caso de uso
interface GetDistinctDatesResponse {
  dates: Date[];
}

export class GetDistinctDatesUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(): Promise<GetDistinctDatesResponse> {
    const dates = await this.attendanceRepository.getDistinctDates();

    if (!dates || dates.length === 0) {
      throw CustomError.notFound("No distinct dates found");
    }

    return {
      dates,
    };
  }
}
