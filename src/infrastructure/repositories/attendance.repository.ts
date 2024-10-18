import { AttendanceRepository } from "../../domain/repositories";
import {
  CreateAttendanceDTO,
  UpdateAttendanceDTO,
  DeleteAttendanceDTO,
  GetAttendanceByDateDTO,
  GetDistinctDatesDTO,
} from "../../domain/dtos/attendance";
import { AttendanceDataSource } from "../../domain/datasources/attendance.datasource";
import { AttendanceEntity } from "../../domain/entities/attendance/attendance.entity";

export class AttendanceMongoRepository implements AttendanceRepository {
  constructor(private readonly dataSource: AttendanceDataSource) {}

  createAttendances(
    createAttendanceDTO: CreateAttendanceDTO[]
  ): Promise<AttendanceEntity[]> {
    return this.dataSource.createAttendances(createAttendanceDTO);
  }

  updateAttendance(
    updateAttendanceDTO: UpdateAttendanceDTO
  ): Promise<AttendanceEntity> {
    return this.dataSource.updateAttendance(updateAttendanceDTO);
  }

  deleteAttendancesByDate(
    deleteAttendanceDTO: DeleteAttendanceDTO
  ): Promise<void> {
    return this.dataSource.deleteAttendancesByDate(deleteAttendanceDTO);
  }

  getAttendancesByDate(
    getAttendanceByDateDTO: GetAttendanceByDateDTO
  ): Promise<AttendanceEntity[]> {
    return this.dataSource.getAttendancesByDate(getAttendanceByDateDTO);
  }

  getDistinctDates(): Promise<Date[]> {
    return this.dataSource.getDistinctDates();
  }
}
