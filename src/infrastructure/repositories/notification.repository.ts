// src/infra/repositories/NotificationMongoRepository.ts

import { NotificationDataSource } from "../../domain/datasources/notification.datasource";
import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
  DeleteNotificationDTO,
  GetNotificationByIdDTO,
  GetAllNotificationsDTO,
} from "../../domain/dtos/notification";
import { NotificationEntity } from "../../domain/entities/notification/NotificationEntity";
import { NotificationRepository } from "../../domain/repositories";

export class NotificationMongoRepository implements NotificationRepository {
  constructor(private readonly dataSource: NotificationDataSource) {}

  createNotification(
    createNotificationDTO: CreateNotificationDTO
  ): Promise<NotificationEntity> {
    return this.dataSource.createNotification(createNotificationDTO);
  }

  updateNotification(
    updateNotificationDTO: UpdateNotificationDTO
  ): Promise<NotificationEntity> {
    return this.dataSource.updateNotification(updateNotificationDTO);
  }

  deleteNotification(
    deleteNotificationDTO: DeleteNotificationDTO
  ): Promise<void> {
    return this.dataSource.deleteNotification(deleteNotificationDTO);
  }

  getNotificationById(
    getNotificationByIdDTO: GetNotificationByIdDTO
  ): Promise<NotificationEntity | null> {
    return this.dataSource.getNotificationById(getNotificationByIdDTO);
  }

  getAllNotifications(): Promise<NotificationEntity[]> {
    return this.dataSource.getAllNotifications();
  }
}
