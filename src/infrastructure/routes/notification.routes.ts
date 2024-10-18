// src/routes/NotificationRoutes.ts
import { Router } from "express";
import { NotificationController } from "../controllers";
import { MongoNotificationDataSource } from "../datasources/mongodb.notification.datasource";
import {
  NodemailerEmailRepository,
  NotificationMongoRepository,
} from "../repositories";
import { NodemailerEmailDataSource } from "../datasources";

export class NotificationRoutes {
  static get routes(): Router {
    const router = Router();

    // Crear instancias de DataSource y Repository
    const notificationDataSource = new MongoNotificationDataSource();
    const notificationRepository = new NotificationMongoRepository(
      notificationDataSource
    );
    const emailDataSource = new NodemailerEmailDataSource();
    const emailRepository = new NodemailerEmailRepository(emailDataSource);

    // Crear el controlador
    const notificationController = new NotificationController(
      notificationRepository,
      emailRepository
    );

    // Crear las rutas
    router.post(
      "/",
      notificationController.create.bind(notificationController)
    );
    router.get(
      "/all",
      notificationController.getAll.bind(notificationController)
    );
    router.get("/:id", notificationController.get.bind(notificationController));
    router.put(
      "/:id",
      notificationController.update.bind(notificationController)
    );
    router.delete(
      "/:id",
      notificationController.delete.bind(notificationController)
    );
    router.post(
      "/send-bulk",
      notificationController.sendBulk.bind(notificationController)
    );

    return router;
  }
}
const notificartionRoutes = NotificationRoutes.routes;

export { notificartionRoutes as router };
