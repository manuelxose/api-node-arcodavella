import { Router } from "express";
import { MongoAttendanceDataSource } from "../datasources";
import { AuthMiddleware } from "../middlewares";
import { AttendanceMongoRepository } from "../repositories/attendance.repository";
import { AttendanceController } from "../controllers/attendance.controller";

export class AttendanceRoutes {
  static get routes(): Router {
    const router = Router();

    // Instanciar el DataSource y el Repository
    const attendanceDataSource = new MongoAttendanceDataSource();
    const attendanceRepository = new AttendanceMongoRepository(
      attendanceDataSource
    );

    // Instanciar el Controller
    const attendanceController = new AttendanceController(attendanceRepository);

    // Definir las rutas

    // Crear múltiples registros de asistencia
    router.post(
      "/create",
      // AuthMiddleware.validateAdminToken,
      attendanceController.create.bind(attendanceController)
    );

    // Actualizar un registro de asistencia por ID
    router.put(
      "/:id",
      // AuthMiddleware.validateAdminToken,
      attendanceController.update.bind(attendanceController)
    );

    // Eliminar registros de asistencia por fecha
    router.delete(
      "/delete-by-date",
      // AuthMiddleware.validateAdminToken,
      attendanceController.deleteByDate.bind(attendanceController)
    );

    // Obtener todos los registros de asistencia por una fecha específica
    router.get(
      "/by-date/:date",
      // AuthMiddleware.validateAdminToken,
      attendanceController.getByDate.bind(attendanceController)
    );

    // Obtener todas las fechas de asistencia distintas
    router.get(
      "/distinct-dates",
      // AuthMiddleware.validateAdminToken,
      attendanceController.getDistinctDatesMethod.bind(attendanceController)
    );

    return router;
  }
}

// Exportar las rutas de Attendance
const attendanceRoutes = AttendanceRoutes.routes;
export { attendanceRoutes as router };
