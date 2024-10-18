// src/domain/repositories/NotificationRepository.ts

import { NotificationEntity } from "../entities/notification/NotificationEntity";

import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
  DeleteNotificationDTO,
  GetNotificationByIdDTO,
} from "../dtos/notification";
import { SendBulkEmailDTO } from "../dtos/email";

export abstract class NotificationRepository {
  abstract createNotification(
    createNotificationDTO: CreateNotificationDTO
  ): Promise<NotificationEntity>;

  abstract updateNotification(
    updateNotificationDTO: UpdateNotificationDTO
  ): Promise<NotificationEntity>;

  abstract deleteNotification(
    deleteNotificationDTO: DeleteNotificationDTO
  ): Promise<void>;

  abstract getNotificationById(
    getNotificationByIdDTO: GetNotificationByIdDTO
  ): Promise<NotificationEntity | null>;

  abstract getAllNotifications(): Promise<NotificationEntity[]>;
}
