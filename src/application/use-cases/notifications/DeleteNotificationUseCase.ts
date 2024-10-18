// src/application/use-cases/notifications/DeleteNotificationUseCase.ts

import { NotificationRepository } from "../../../domain/repositories";
import { CustomError } from "../../../domain/errors";
import { DeleteNotificationDTO } from "../../../domain/dtos/notification";
// Interfaz de respuesta
interface DeleteNotificationResponse {
  message: string;
}

export class DeleteNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  // Método de ejecución del caso de uso
  async execute(
    deleteNotificationDTO: DeleteNotificationDTO
  ): Promise<DeleteNotificationResponse> {
    const notification = await this.notificationRepository.getNotificationById({
      id: deleteNotificationDTO.id,
    });

    if (!notification) {
      throw CustomError.notFound("Notification not found");
    }

    await this.notificationRepository.deleteNotification(deleteNotificationDTO);

    return {
      message: "Notification deleted successfully",
    };
  }
}
