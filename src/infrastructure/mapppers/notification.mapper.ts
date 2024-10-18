import { NotificationEntity } from "../../domain/entities/notification/NotificationEntity";
import {
  StatusCodes,
  RecipientTypes,
  NotificationTypes,
} from "../../domain/enums";

export class NotificationMapper {
  // Convierte un objeto genérico (parcial) en una NotificationEntity
  static toEntity(data: Partial<NotificationEntity>): NotificationEntity {
    return NotificationEntity.create({
      id: data.id || "",
      recipientId: data.recipientId || "",
      recipientType: data.recipientType || RecipientTypes.USER, // Valor por defecto
      type: data.type || NotificationTypes.USER_REQUEST, // Valor por defecto
      message: data.message || "",
      title: data.title || "Sin título", // Valor por defecto
      summary: data.summary || "Sin resumen", // Valor por defecto
      status: data.status || StatusCodes.UNREAD, // Valor por defecto
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    });
  }

  // Convierte una NotificationEntity en un objeto genérico (parcial)
  static toDTO(entity: NotificationEntity): Record<string, any> {
    return {
      id: entity.id,
      recipientId: entity.recipientId,
      recipientType: entity.recipientType,
      type: entity.type,
      message: entity.message,
      title: entity.title, // Incluir 'title'
      summary: entity.summary, // Incluir 'summary'
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // Convierte un array de NotificationEntity en un array de objetos genéricos
  static toDTOs(entities: NotificationEntity[]): Record<string, any>[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  // Actualiza una entidad existente clonándola con los datos parciales proporcionados
  static updateEntity(
    entity: NotificationEntity,
    data: Partial<NotificationEntity>
  ): NotificationEntity {
    return entity.clone({
      recipientId: data.recipientId,
      recipientType: data.recipientType,
      type: data.type,
      message: data.message,
      title: data.title, // Incluir 'title'
      summary: data.summary, // Incluir 'summary'
      status: data.status,
      updatedAt: new Date(), // Siempre actualizamos la fecha de modificación
    });
  }
}
