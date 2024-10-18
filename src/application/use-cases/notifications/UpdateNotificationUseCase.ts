// src/application/use-cases/notifications/UpdateNotificationUseCase.ts

import { NotificationRepository } from "../../../domain/repositories";
import { UpdateNotificationDTO } from "../../../domain/dtos/notification/UpdateNotificationDTO";
import { CustomError } from "../../../domain/errors";

// Interfaz de respuesta
interface UpdateNotificationResponse {
  id: string;
  recipientId: string;
  recipientType: string;
  type: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class UpdateNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  // Método de ejecución del caso de uso
  async execute(
    updateNotificationDTO: UpdateNotificationDTO
  ): Promise<UpdateNotificationResponse> {
    console.log("update notificaciron:", updateNotificationDTO);

    const notification = await this.notificationRepository.updateNotification(
      updateNotificationDTO
    );

    if (!notification) {
      throw CustomError.notFound("Notification not found");
    }

    return {
      id: notification.id,
      recipientId: notification.recipientId,
      recipientType: notification.recipientType,
      type: notification.type,
      message: notification.message,
      status: notification.status,
      createdAt: notification.createdAt,
      //   updatedAt: notification.updatedAt,
    };
  }
}
