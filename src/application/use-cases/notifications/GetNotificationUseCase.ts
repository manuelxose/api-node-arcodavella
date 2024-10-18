// src/application/use-cases/notifications/GetNotificationByIdUseCase.ts

import { NotificationRepository } from "../../../domain/repositories";
import { CustomError } from "../../../domain/errors";
import { GetNotificationByIdDTO } from "../../../domain/dtos/notification";

// Interfaz de respuesta
interface GetNotificationByIdResponse {
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
}

export class GetNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  // Método de ejecución del caso de uso
  async execute(
    getNotificationByIdDTO: GetNotificationByIdDTO
  ): Promise<GetNotificationByIdResponse> {
    const notification = await this.notificationRepository.getNotificationById(
      getNotificationByIdDTO
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
      title: notification.title,
      summary: notification.summary,
      status: notification.status,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}
