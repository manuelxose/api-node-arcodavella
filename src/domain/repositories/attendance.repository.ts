import {
  CreateAttendanceDTO,
  UpdateAttendanceDTO,
  DeleteAttendanceDTO,
  GetAttendanceByDateDTO,
} from "../dtos/attendance";
import { AttendanceEntity } from "../entities/attendance/attendance.entity";

export abstract class AttendanceRepository {
  // Crear múltiples asistencias
  abstract createAttendances(
    createAttendanceDTO: CreateAttendanceDTO[]
  ): Promise<AttendanceEntity[]>;

  // Actualizar una asistencia específica
  abstract updateAttendance(
    updateAttendanceDTO: UpdateAttendanceDTO
  ): Promise<AttendanceEntity>;

  // Eliminar asistencias por fecha
  abstract deleteAttendancesByDate(
    deleteAttendanceDTO: DeleteAttendanceDTO
  ): Promise<void>;

  // Obtener todas las asistencias de una fecha específica
  abstract getAttendancesByDate(
    getAttendanceByDateDTO: GetAttendanceByDateDTO
  ): Promise<AttendanceEntity[]>;

  // Obtener todas las fechas distintas de las asistencias
  abstract getDistinctDates(): Promise<Date[]>;
}
