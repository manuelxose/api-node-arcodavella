// src/domain/datasources/NotificationDataSource.ts

import { SendBulkEmailDTO } from "../dtos/email";
import {
  CreateNotificationDTO,
  DeleteNotificationDTO,
  GetAllNotificationsDTO,
  GetNotificationByIdDTO,
  UpdateNotificationDTO,
} from "../dtos/notification";
import { NotificationEntity } from "../entities/notification/NotificationEntity";

export abstract class NotificationDataSource {
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

  abstract getAllNotificationsByRecipient(
    GetAllNotificationDTO: GetAllNotificationsDTO
  ): Promise<NotificationEntity[]>;

  abstract getAllNotifications(): Promise<NotificationEntity[]>;
}
