import logger from "../../../core/adapters/logger";
import { SendBulkEmailDTO } from "../../../domain/dtos/email";
import {
  EmailRepository,
  NotificationRepository,
} from "../../../domain/repositories";
import { CreateNotificationDTO } from "../../../domain/dtos/notification";
import {
  NotificationTypes,
  RecipientTypes,
  StatusCodes,
} from "../../../domain/enums";
import { CustomError } from "../../../domain/errors";

export class SendBulkNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly emailRepo: EmailRepository
  ) {}

  /**
   * Ejecuta el caso de uso para enviar notificaciones en bloque y notificar a los administradores.
   * @param sendBulkEmailDTO Instancia del DTO que contiene los correos a enviar.
   * @returns Un objeto con el resultado del envío de notificaciones.
   */
  async execute(
    sendBulkEmailDTO: SendBulkEmailDTO
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Enviar los correos electrónicos en masa
      await this.emailRepo.sendBulkEmail(sendBulkEmailDTO);

      // Crear la notificación de que se han enviado los correos
      const [error, notificationDTO] = CreateNotificationDTO.create({
        recipientId: "admin", // ID del destinatario (administrador)
        recipientType: RecipientTypes.ADMIN, // Tipo de destinatario: Admin
        type: NotificationTypes.EMAIL_SENT, // Tipo de notificación: Envío de correos
        title: "Correos enviados en masa",
        summary: `Se han enviado ${sendBulkEmailDTO.emails.length} correos electrónicos.`,
        message: `Se ha completado el envío en masa de correos electrónicos. Un total de ${sendBulkEmailDTO.emails.length} correos fueron enviados exitosamente.`,
        status: StatusCodes.UNREAD, // Estado de la notificación: No leída
      });

      // Verificar si hubo un error en la creación del DTO de notificación
      if (error) {
        throw CustomError.internal(
          "Fallo al crear la notificación de correos enviados"
        );
      }

      // Guardar la notificación en el repositorio de notificaciones
      await this.notificationRepository.createNotification(notificationDTO!);

      // Registro en log de éxito
      logger.info("Correos enviados y notificación creada correctamente.");
      return {
        success: true,
        message: "Correos enviados y notificación creada correctamente.",
      };
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        logger.error(
          `Error al enviar correos y crear notificación: ${err.message}`
        );
        return {
          success: false,
          message: "Error al enviar los correos y crear la notificación.",
        };
      } else {
        logger.error(`Error al enviar correos y crear notificación: ${err}`);
        return {
          success: false,
          message: "Error al enviar los correos y crear la notificación.",
        };
      }
    }
  }
}
