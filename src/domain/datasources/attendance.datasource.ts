import {
  UpdateAttendanceDTO,
  DeleteAttendanceDTO,
  GetAttendanceByDateDTO,
  CreateAttendanceDTO,
} from "../dtos/attendance";
import { AttendanceEntity } from "../entities/attendance/attendance.entity";

export abstract class AttendanceDataSource {
  // Crear múltiples asistencias
  abstract createAttendances(
    createAttendanceDTO: CreateAttendanceDTO[]
  ): Promise<AttendanceEntity[]>;

  // Actualizar una asistencia específica
  abstract updateAttendance(
    updateAttendanceDTO: UpdateAttendanceDTO
  ): Promise<AttendanceEntity>;

  // Eliminar asistencias por fecha (borrado múltiple)
  abstract deleteAttendancesByDate(
    deleteAttendanceDTO: DeleteAttendanceDTO
  ): Promise<void>;

  // Obtener todas las asistencias de una fecha específica
  abstract getAttendancesByDate(
    getAttendanceByDateDTO: GetAttendanceByDateDTO
  ): Promise<AttendanceEntity[]>;

  // Obtener todas las fechas distintas
  abstract getDistinctDates(): Promise<Date[]>;
}
