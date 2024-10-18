// src/controllers/NotificationController.ts
import { Request, Response, NextFunction } from "express";
import { NotificationMongoRepository } from "../repositories";
import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
  DeleteNotificationDTO,
  GetNotificationByIdDTO,
} from "../../domain/dtos/notification";
import {
  CreateNotificationUseCase,
  DeleteNotificationUseCase,
  GetAllNotificationsUseCase,
  GetNotificationUseCase,
  UpdateNotificationUseCase,
} from "../../application/use-cases/notifications";
import { CustomError } from "../../domain/errors";
import logger from "../../core/adapters/logger";
import { ZlibAdapter } from "../../core/adapters/zlib";
import { SendBulkEmailDTO } from "../../domain/dtos/email";
import { SendBulkNotificationsUseCase } from "../../application/use-cases/notifications/sendBulkNotifications.use-case";
import { EmailRepository } from "../../domain/repositories";

export class NotificationController {
  private createNotification: CreateNotificationUseCase;
  private getNotification: GetNotificationUseCase;
  private getAllNotification: GetAllNotificationsUseCase;
  private deleteNotification: DeleteNotificationUseCase;
  private updateNotification: UpdateNotificationUseCase;
  private sendBulkNotification: SendBulkNotificationsUseCase;

  constructor(
    private readonly notificationRepository: NotificationMongoRepository,
    private readonly emailRepository: EmailRepository
  ) {
    this.createNotification = new CreateNotificationUseCase(
      this.notificationRepository
    );
    this.getNotification = new GetNotificationUseCase(
      this.notificationRepository
    );
    this.getAllNotification = new GetAllNotificationsUseCase(
      this.notificationRepository
    );
    this.deleteNotification = new DeleteNotificationUseCase(
      this.notificationRepository
    );
    this.updateNotification = new UpdateNotificationUseCase(
      this.notificationRepository
    );
    this.sendBulkNotification = new SendBulkNotificationsUseCase(
      this.notificationRepository,
      this.emailRepository
    );
  }

  // Método para manejar errores
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    logger.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }

  // Método para crear una notificación
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { data } = req.body;
      console.log("los datos:", data);

      const [error, createNotificationDTO] = CreateNotificationDTO.create(data);
      if (error) {
        console.log("error: ", error.message);
        return res.status(400).send({ error: error.message });
      }

      const notification = await this.createNotification.execute(
        createNotificationDTO!
      );
      res.status(201).json(notification);
    } catch (err) {
      next(err);
    }
  }

  // Método para obtener todas las notificaciones de un destinatario específico
  async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const [error, getNotificationDTO] = GetNotificationByIdDTO.create({
      id: req.params.id,
    });
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    try {
      this.getNotification
        .execute(getNotificationDTO!)
        .then((member) => {
          if (!member) {
            return res.status(404).send({ error: "Member not found" });
          }
          res.status(200).send(member);
        })
        .catch((error) => {
          this.handleError(error, res);
        });
    } catch (error) {
      next(error);
    }
  }

  // Método para obtener todas las notificaciones
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await this.getAllNotification.execute();
      res.status(200).json(notifications);
    } catch (err) {
      next(err);
    }
  }

  // Método para actualizar el estado de una notificación
  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    console.log("los datos enviados: ", req.body);

    try {
      const [error, updateNotificationDTO] = UpdateNotificationDTO.create({
        id: req.params.id,
        status: req.body.status,
      });
      if (error) {
        return res.status(400).send({ error: error.message });
      }

      const updatedNotification = await this.updateNotification.execute(
        updateNotificationDTO!
      );
      res.status(200).json(updatedNotification);
    } catch (err) {
      next(err);
    }
  }

  // Método para eliminar una notificación por su ID
  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const [error, deleteNotificationDTO] = DeleteNotificationDTO.create({
        id: req.params.id,
      });
      if (error) {
        return res.status(400).send({ error: error.message });
      }

      await this.deleteNotification.execute(deleteNotificationDTO!);
      res.status(200).send({ message: "Notification deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  // TODO: Implementar Controlador y repositorio especifico para envio de correos;

  /**
   * Método para enviar notificaciones en lote
   */
  async sendBulk(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const chunks: Buffer[] = [];
      console.log("Entra en el método sendBulk");

      // Acumular los datos recibidos
      req.on("data", (chunk) => {
        console.log("Recibiendo chunk de datos");
        chunks.push(chunk);
      });

      // Procesar los datos al finalizar la recepción
      req.on("end", async () => {
        console.log("Finalizó la recepción de datos");
        try {
          const buffer = Buffer.concat(chunks);
          console.log("Buffer concatenado:", buffer);

          // Verificar si los datos parecen estar comprimidos en Gzip
          if (!ZlibAdapter.isGzip(buffer)) {
            console.error(
              "Los datos recibidos no parecen estar comprimidos en Gzip."
            );
            return res
              .status(400)
              .send({ error: "Los datos no están comprimidos correctamente." });
          }

          // Descomprimir los datos usando el adaptador Zlib
          const decompressedBuffer = await ZlibAdapter.decompress(buffer);
          console.log("Buffer descomprimido:", decompressedBuffer);

          // Convertir el buffer descomprimido a string y luego a objeto JSON
          const decompressedData = decompressedBuffer.toString("utf-8");

          let notificationsData;
          try {
            notificationsData = JSON.parse(decompressedData);
            console.log("Datos JSON parseados:", notificationsData);
          } catch (parseError) {
            console.error("Error al parsear JSON:", parseError);
            return res
              .status(400)
              .send({ error: "Error al parsear los datos JSON" });
          }

          // Validar y crear el DTO para el envío masivo
          const [error, sendBulkNotificationDTO] = SendBulkEmailDTO.create({
            emails: notificationsData.emails, // asumiendo que los datos vienen en un formato específico
          });

          if (error) {
            console.error("Error al crear el DTO:", error);
            return res.status(400).send({ error: error.message });
          }

          // Ejecutar la lógica de envío de notificaciones en lote
          try {
            console.log("Ejecutando sendBulkNotification");
            const result = await this.sendBulkNotification.execute(
              sendBulkNotificationDTO!
            );
            console.log("Resultado del envío:", result);
            res
              .status(200)
              .json({ message: "Notificaciones enviadas con éxito", result });
          } catch (executionError) {
            console.error(
              "Error durante la ejecución del envío:",
              executionError
            );
            next(executionError);
          }
        } catch (error: unknown) {
          console.error("Error al procesar los datos:", error);
          res.status(400).send({ error: error });
        }
      });

      req.on("error", (err) => {
        console.error("Error durante la recepción de datos:", err);
        next(err);
      });
    } catch (err) {
      console.error("Error general en sendBulk:", err);
      next(err);
    }
  }
}
