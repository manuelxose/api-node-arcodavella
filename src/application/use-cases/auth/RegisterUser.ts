import {
  AuthRepository,
  NotificationRepository,
} from "../../../domain/repositories";
import { RegisterUserDTO } from "../../../domain/dtos/auth";
import { CreateNotificationDTO } from "../../../domain/dtos/notification";
import {
  NotificationTypes,
  RecipientTypes,
  StatusCodes,
} from "../../../domain/enums";
import { CustomError } from "../../../domain/errors";

interface RegisterResponse {
  id: string;
  role: string;
  email: string;
}

export class RegisterUser {
  constructor(
    private authRepository: AuthRepository,
    private notificationRepository: NotificationRepository // Inyectamos el repositorio de notificaciones
  ) {}

  async execute(registerUserDTO: RegisterUserDTO): Promise<RegisterResponse> {
    // Registrar al usuario

    const user = await this.authRepository.register(registerUserDTO);

    // Crear el DTO de la notificación, ahora con 'title', 'summary' y 'message' correctamente definidos
    const [error, notificationDTO] = CreateNotificationDTO.create({
      recipientId: user.id, // ID de los administradores
      recipientType: RecipientTypes.ADMIN, // Destinatarios son los administradores
      type: NotificationTypes.USER_REQUEST, // Tipo de notificación
      title: "Nueva solicitud de registro",
      summary: `Solicitud de registro del usuario ${user.email}.`, // Mensaje corto
      message: `El usuario con ID ${user.id} y email ${user.email} ha solicitado registrarse en el sistema. Por favor, revisa la solicitud y toma las medidas necesarias.`, // Mensaje largo
      status: StatusCodes.UNREAD, // La notificación está sin leer
    });

    // Verificar si hubo un error en la creación del DTO
    if (error) {
      throw CustomError.internal("Fallo al crear la notificación");
    }

    // Crear la notificación en el repositorio
    await this.notificationRepository.createNotification(notificationDTO!);

    // Retornar los detalles del usuario registrado
    return {
      id: user.id,
      role: user.role,
      email: user.email,
    };
  }
}
