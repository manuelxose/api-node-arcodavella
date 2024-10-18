import {
  CreateAttendanceDTO,
  UpdateAttendanceDTO,
  DeleteAttendanceDTO,
  GetAttendanceByDateDTO,
} from "../../domain/dtos/attendance";
import { CustomError } from "../../domain/errors";
import AttendanceModel from "../../data/mongodb/models/attendance.model";
import { AttendanceDataSource } from "../../domain/datasources/attendance.datasource";
import { AttendanceEntity } from "../../domain/entities/attendance/attendance.entity";
import { AttendanceMapper } from "../mapppers/attendance.mapper";
import { Validators } from "../../shared";

export class MongoAttendanceDataSource implements AttendanceDataSource {
  // Crear múltiples asistencias
  async createAttendances(
    createAttendanceDTO: CreateAttendanceDTO[]
  ): Promise<AttendanceEntity[]> {
    try {
      const newAttendances = [];

      for (const dto of createAttendanceDTO) {
        // Validate the DTO fields
        if (!dto.dni || !dto.date || !dto.name) {
          throw CustomError.badRequest(
            "Missing required fields: DNI, date, or name for attendance"
          );
        }

        // Validate date format (example of custom validation)
        if (!Validators.isValidDate(dto.date)) {
          throw CustomError.badRequest("Invalid date format");
        }

        // Check if attendance with the same DNI and date already exists
        const existingAttendance = await AttendanceModel.findOne({
          dni: dto.dni,
          date: dto.date,
        });

        // If no attendance exists, add it to the list of new attendances
        if (!existingAttendance) {
          newAttendances.push({
            name: dto.name,
            email: dto.email,
            dni: dto.dni,
            memberNumber: dto.memberNumber,
            date: dto.date,
            entry: dto.entry,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // If no new attendances were found, return an empty array
      if (newAttendances.length === 0) {
        return [];
      }

      // Insert new attendances into the database
      const insertedAttendances = await AttendanceModel.insertMany(
        newAttendances
      );

      // Return newly created attendances as entities
      return insertedAttendances.map(AttendanceMapper.toEntity);
    } catch (error) {
      if (error instanceof CustomError) {
        // Handle custom errors gracefully
        console.error("Custom Error:", error.message);
        throw error; // Re-throw custom error to the calling function
      } else {
        // Handle unexpected errors (database issues, etc.)
        console.error("Unexpected Error:", error);
        throw CustomError.internal(
          "An unexpected error occurred while creating attendances"
        );
      }
    }
  }
  // Actualizar una asistencia específica
  async updateAttendance(
    updateAttendanceDTO: UpdateAttendanceDTO
  ): Promise<AttendanceEntity> {
    const updatedAttendance = await AttendanceModel.findByIdAndUpdate(
      updateAttendanceDTO.id,
      {
        name: updateAttendanceDTO.name,
        email: updateAttendanceDTO.email,
        dni: updateAttendanceDTO.dni,
        memberNumber: updateAttendanceDTO.memberNumber,
        date: updateAttendanceDTO.date,
        entry: updateAttendanceDTO.entry,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedAttendance) {
      throw CustomError.notFound("Attendance not found");
    }

    return AttendanceMapper.toEntity(updatedAttendance);
  }

  // Eliminar asistencias por fecha
  async deleteAttendancesByDate(
    deleteAttendanceDTO: DeleteAttendanceDTO
  ): Promise<void> {
    const result = await AttendanceModel.deleteMany({
      date: deleteAttendanceDTO.date,
    });

    if (result.deletedCount === 0) {
      throw CustomError.notFound(
        "No attendance records found for the given date"
      );
    }
  }

  // Obtener todas las asistencias de una fecha específica
  async getAttendancesByDate(
    getAttendanceByDateDTO: GetAttendanceByDateDTO
  ): Promise<AttendanceEntity[]> {
    const attendances = await AttendanceModel.find({
      date: getAttendanceByDateDTO.date,
    });

    if (!attendances || attendances.length === 0) {
      throw CustomError.notFound(
        "No attendance records found for the given date"
      );
    }

    return attendances.map(AttendanceMapper.toEntity);
  }

  // Obtener todas las fechas distintas de las asistencias
  async getDistinctDates(): Promise<Date[]> {
    const distinctDates = await AttendanceModel.distinct("date");

    if (!distinctDates || distinctDates.length === 0) {
      throw CustomError.notFound("No distinct dates found");
    }

    return distinctDates;
  }
}
