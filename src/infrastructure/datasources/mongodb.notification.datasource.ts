// src/infra/datasources/MongoNotificationDataSource.ts

import NotificationModel from "../../data/mongodb/models/NotificationModel";
import { NotificationDataSource } from "../../domain/datasources/notification.datasource";
import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
  DeleteNotificationDTO,
  GetNotificationByIdDTO,
  GetAllNotificationsDTO,
} from "../../domain/dtos/notification";
import { NotificationEntity } from "../../domain/entities/notification/NotificationEntity";
import { StatusCodes } from "../../domain/enums/StatusCodes";
import { CustomError } from "../../domain/errors/custom.errors";

export class MongoNotificationDataSource implements NotificationDataSource {
  // Crea una nueva notificación
  async createNotification(
    createNotificationDTO: CreateNotificationDTO
  ): Promise<NotificationEntity> {
    try {
      // Validaciones de datos de entrada
      if (!createNotificationDTO.recipientId) {
        throw CustomError.badRequest("Recipient ID is required");
      }

      if (!createNotificationDTO.recipientType) {
        throw CustomError.badRequest("Recipient type is required");
      }

      if (!createNotificationDTO.message) {
        throw CustomError.badRequest("Message is required");
      }

      if (!createNotificationDTO.title) {
        throw CustomError.badRequest("Title is required");
      }

      if (!createNotificationDTO.summary) {
        throw CustomError.badRequest("Summary is required");
      }

      // Crear la notificación directamente sin agrupar los datos
      const notification = new NotificationModel({
        recipientId: createNotificationDTO.recipientId,
        recipientType: createNotificationDTO.recipientType,
        type: createNotificationDTO.type,
        message: createNotificationDTO.message,
        title: createNotificationDTO.title,
        summary: createNotificationDTO.summary,
        status: StatusCodes.UNREAD,
        fieldToUpdate: createNotificationDTO.fieldToUpdate, // Guardar el campo solicitado para modificación
        newValue: createNotificationDTO.newValue, // Guardar el nuevo valor
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await notification.save();

      return NotificationEntity.create({
        id: notification._id.toString(),
        recipientId: notification.recipientId,
        recipientType: notification.recipientType,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        summary: notification.summary,
        status: notification.status,
        fieldToUpdate: notification.fieldToUpdate, // Guardar el campo solicitado
        newValue: notification.newValue, // Guardar el nuevo valor propuesto
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internal("Error creating notification");
    }
  }

  // Actualiza una notificación existente
  async updateNotification(
    updateNotificationDTO: UpdateNotificationDTO
  ): Promise<NotificationEntity> {
    try {
      if (!updateNotificationDTO.id) {
        throw CustomError.badRequest("Notification ID is required");
      }

      const notification = await NotificationModel.findById(
        updateNotificationDTO.id
      );

      if (!notification) {
        throw CustomError.notFound("Notification not found");
      }

      if (
        updateNotificationDTO.status &&
        !Object.values(StatusCodes).includes(updateNotificationDTO.status)
      ) {
        throw CustomError.badRequest("Invalid status code");
      }

      // Actualizar los campos de la notificación
      notification.status = updateNotificationDTO.status || notification.status;
      notification.title = updateNotificationDTO.title || notification.title;
      notification.summary =
        updateNotificationDTO.summary || notification.summary;
      notification.fieldToUpdate =
        updateNotificationDTO.fieldToUpdate || notification.fieldToUpdate;
      notification.newValue =
        updateNotificationDTO.newValue || notification.newValue; // Actualizar el nuevo valor propuesto
      notification.updatedAt = new Date();

      await notification.save();

      return NotificationEntity.create({
        id: notification._id.toString(),
        recipientId: notification.recipientId,
        recipientType: notification.recipientType,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        summary: notification.summary,
        status: notification.status,
        fieldToUpdate: notification.fieldToUpdate, // Devolver el campo actualizado
        newValue: notification.newValue, // Devolver el nuevo valor propuesto
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internal("Error updating notification");
    }
  }

  // Elimina una notificación por ID
  async deleteNotification(
    deleteNotificationDTO: DeleteNotificationDTO
  ): Promise<void> {
    try {
      // Validación del ID
      if (!deleteNotificationDTO.id) {
        throw CustomError.badRequest("Notification ID is required");
      }

      const notification = await NotificationModel.findById(
        deleteNotificationDTO.id
      );

      if (!notification) {
        throw CustomError.notFound("Notification not found");
      }

      await NotificationModel.findByIdAndDelete(deleteNotificationDTO.id);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internal("Error deleting notification");
    }
  }

  // Obtiene una notificación por su ID
  async getNotificationById(
    getNotificationByIdDTO: GetNotificationByIdDTO
  ): Promise<NotificationEntity | null> {
    try {
      const notification = await NotificationModel.findById(
        getNotificationByIdDTO.id
      );

      if (!notification) {
        throw CustomError.notFound("Notification not found");
      }

      return NotificationEntity.create({
        id: notification._id.toString(),
        recipientId: notification.recipientId,
        recipientType: notification.recipientType,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        summary: notification.summary,
        status: notification.status,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });
    } catch (error) {
      throw CustomError.internal("Error retrieving notification");
    }
  }
  // Obtiene todas las notificaciones de un destinatario específico
  async getAllNotificationsByRecipient(
    getAllNotificationDTO: GetAllNotificationsDTO
  ): Promise<NotificationEntity[]> {
    try {
      if (!getAllNotificationDTO.recipientId) {
        throw CustomError.badRequest("Recipient ID is required");
      }

      const notifications = await NotificationModel.find({
        recipientId: getAllNotificationDTO.recipientId,
        recipientType: getAllNotificationDTO.recipientType,
      });

      if (notifications.length === 0) {
        throw CustomError.notFound("No notifications found for this recipient");
      }

      return notifications.map((notification) =>
        NotificationEntity.create({
          id: notification._id.toString(),
          recipientId: notification.recipientId,
          recipientType: notification.recipientType,
          type: notification.type,
          message: notification.message,
          title: notification.title,
          summary: notification.summary,
          status: notification.status,
          fieldToUpdate: notification.fieldToUpdate, // Manejar campo opcional
          newValue: notification.newValue, // Manejar campo opcional
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        })
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internal("Error retrieving notifications");
    }
  }

  // Obtiene todas las notificaciones
  async getAllNotifications(): Promise<NotificationEntity[]> {
    try {
      const notifications = await NotificationModel.find();

      if (notifications.length === 0) {
        throw CustomError.notFound("No notifications found");
      }

      return notifications.map((notification) =>
        NotificationEntity.create({
          id: notification._id.toString(),
          recipientId: notification.recipientId,
          recipientType: notification.recipientType,
          type: notification.type,
          message: notification.message,
          title: notification.title,
          summary: notification.summary,
          status: notification.status,
          fieldToUpdate: notification.fieldToUpdate, // Manejar campo opcional
          newValue: notification.newValue, // Manejar campo opcional
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        })
      );
    } catch (error) {
      throw CustomError.internal("Error retrieving all notifications");
    }
  }
}
