import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.errors";
import logger from "../../core/adapters/logger";

import {
  CreateAttendanceDTO,
  UpdateAttendanceDTO,
  DeleteAttendanceDTO,
  GetAttendanceByDateDTO,
} from "../../domain/dtos/attendance";
import {
  CreateAttendanceUseCase,
  UpdateAttendanceUseCase,
  DeleteAttendanceByDateUseCase,
  GetAttendanceByDateUseCase,
  GetDistinctDatesUseCase,
} from "../../application/use-cases/attendance";
import { AttendanceMongoRepository } from "../repositories/attendance.repository";

export class AttendanceController {
  private createAttendances: CreateAttendanceUseCase;
  private updateAttendance: UpdateAttendanceUseCase;
  private deleteAttendancesByDate: DeleteAttendanceByDateUseCase;
  private getAttendancesByDate: GetAttendanceByDateUseCase;
  private getDistinctDates: GetDistinctDatesUseCase;

  constructor(
    private readonly attendanceRepository: AttendanceMongoRepository
  ) {
    this.createAttendances = new CreateAttendanceUseCase(
      this.attendanceRepository
    );
    this.updateAttendance = new UpdateAttendanceUseCase(
      this.attendanceRepository
    );
    this.deleteAttendancesByDate = new DeleteAttendanceByDateUseCase(
      this.attendanceRepository
    );
    this.getAttendancesByDate = new GetAttendanceByDateUseCase(
      this.attendanceRepository
    );
    this.getDistinctDates = new GetDistinctDatesUseCase(
      this.attendanceRepository
    );
  }

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    logger.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }
  public async create(req: Request, res: Response): Promise<Response | void> {
    // Crear los DTOs validados para todas las asistencias
    const [error, createAttendanceDTOs] = CreateAttendanceDTO.create(req.body);
    if (error) {
      console.log("el error", error);
      return res.status(400).send({ error: error.message });
    }

    // Si no hay errores, procesar cada DTO con el caso de uso
    const createPromises = createAttendanceDTOs!.map((dto) => {
      return this.createAttendances.execute(dto); // Ejecuta el caso de uso y devuelve la promesa
    });

    // Esperar a que todas las promesas se resuelvan
    Promise.all(createPromises)
      .then(() => {
        res.status(201).send({ message: "Asistencias creadas con éxito" }); // Enviar mensaje general
      })
      .catch((error) => {
        this.handleError(error, res); // Manejar errores si alguna promesa falla
      });
  }

  public async update(req: Request, res: Response): Promise<Response | void> {
    const [error, updateAttendanceDTO] = UpdateAttendanceDTO.create({
      id: req.params.id,
      ...req.body,
    });
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    this.updateAttendance
      .execute(updateAttendanceDTO!)
      .then((attendance) => {
        res.status(200).send(attendance);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  public async deleteByDate(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const [error, deleteAttendanceDTO] = DeleteAttendanceDTO.create(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    this.deleteAttendancesByDate
      .execute(deleteAttendanceDTO!)
      .then(() => {
        res.status(200).send({ message: "Deleted successfully" });
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }
  public async getByDate(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    // Convertimos el string recibido desde req.params.date a un objeto Date
    const [error, getAttendanceByDateDTO] = GetAttendanceByDateDTO.create({
      date: req.params.date, // req.params.date llega como string
    });

    // Si hay un error de validación o conversión, respondemos con un código 400
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    // Ejecutamos el caso de uso con el DTO creado
    this.getAttendancesByDate
      .execute(getAttendanceByDateDTO!)
      .then((attendances) => {
        // Si no se encuentran registros, respondemos con 404
        if (!attendances.length) {
          return res
            .status(404)
            .send({ error: "No attendances found for the given date" });
        }
        // Si se encuentran registros, los enviamos con un código 200
        res.status(200).send(attendances);
      })
      .catch((error) => {
        // Manejo de cualquier error que ocurra en el proceso
        this.handleError(error, res);
      });
  }

  public async getDistinctDatesMethod(
    _req: Request,
    res: Response
  ): Promise<Response | void> {
    this.getDistinctDates
      .execute()
      .then((dates) => {
        res.status(200).send(dates);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }
}
