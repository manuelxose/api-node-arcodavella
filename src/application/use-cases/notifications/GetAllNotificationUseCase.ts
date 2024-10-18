// src/application/use-cases/notifications/GetAllNotificationsUseCase.ts

import { NotificationEntity } from "../../../domain/entities/notification/NotificationEntity";
import { NotificationRepository } from "../../../domain/repositories";
interface GetAllNotificationsResponse {
  notifications: {
    id: string;
    recipientId: string;
    recipientType: string;
    type: string;
    message: string;
    title: string;
    summary: string;
    status: string;
    createdAt: Date;
    updatedAt?: Date;
  }[];
}
export class GetAllNotificationsUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  // Interfaz de respuesta

  // Método de ejecución del caso de uso
  async execute(): Promise<GetAllNotificationsResponse> {
    const notifications =
      await this.notificationRepository.getAllNotifications();

    return {
      notifications: notifications.map((notification: NotificationEntity) => ({
        id: notification.id,
        recipientId: notification.recipientId,
        recipientType: notification.recipientType,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        summary: notification.summary,
        status: notification.status,
        fieldToUpdate: notification.fieldToUpdate, // Campo que se solicita modificar (opcional)
        newValue: notification.newValue, // Nuevo valor propuesto (opcional)
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      })),
    };
  }
}
