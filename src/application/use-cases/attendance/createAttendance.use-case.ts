import { CreateAttendanceDTO } from "../../../domain/dtos/attendance";
import { CustomError } from "../../../domain/errors";
import { AttendanceRepository } from "../../../domain/repositories";

// Interfaz para la respuesta del caso de uso
interface CreateAttendanceResponse {
  created: number;
  duplicates: number;
  message: string;
}

export class CreateAttendanceUseCase {
  constructor(private attendanceRepository: AttendanceRepository) {}

  async execute(
    createAttendanceDTO: CreateAttendanceDTO
  ): Promise<CreateAttendanceResponse> {
    // Llamamos al repositorio para crear las asistencias
    const response = await this.attendanceRepository.createAttendances([
      createAttendanceDTO,
    ]);

    // Si no hay respuesta, significa que nada fue creado
    if (!response) {
      throw CustomError.internal("Unexpected error during creation process.");
    }

    // Contamos cuántas asistencias fueron creadas y cuántas eran duplicados
    const createdCount = response.length;
    const totalCount = 1; // Estamos enviando solo una asistencia en este caso
    const duplicatesCount = totalCount - createdCount;

    // Mensaje informativo
    let message;
    if (duplicatesCount > 0) {
      message = `${createdCount} asistencia(s) creada(s), ${duplicatesCount} duplicado(s) ignorado(s).`;
    } else {
      message = `${createdCount} asistencia(s) creada(s) sin duplicados.`;
    }

    return {
      created: createdCount,
      duplicates: duplicatesCount,
      message,
    };
  }
}
