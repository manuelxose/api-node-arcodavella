// src/application/use-cases/notifications/CreateNotificationUseCase.ts

import { CreateNotificationDTO } from "../../../domain/dtos/notification/CreateNotificationDTO";
import { NotificationRepository } from "../../../domain/repositories";
import { CustomError } from "../../../domain/errors";
// Interfaz de respuesta
interface CreateNotificationResponse {
  id: string;
  recipientId: string;
  recipientType: string;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
}

export class CreateNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(
    createNotificationDTO: CreateNotificationDTO
  ): Promise<CreateNotificationResponse> {
    // Crear la notificación en el repositorio
    const notification = await this.notificationRepository.createNotification(
      createNotificationDTO
    );

    if (!notification) {
      throw CustomError.badRequest("Error creating notification");
    }

    // Devolver la respuesta estructurada
    return {
      id: notification.id,
      recipientId: notification.recipientId,
      recipientType: notification.recipientType,
      type: notification.type,
      message: notification.message,
      status: notification.status,
      createdAt: notification.createdAt,
    };
  }
}
