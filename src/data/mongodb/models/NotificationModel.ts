import { Schema, model, Document, Types } from "mongoose";
import { NotificationTypes } from "../../../domain/enums/NotificationTypes";
import { StatusCodes } from "../../../domain/enums/StatusCodes";
import { RecipientTypes } from "../../../domain/enums/RecipientTypes";

// Interfaz que define la estructura del documento de notificación en MongoDB
interface INotification extends Document {
  _id: Types.ObjectId;
  recipientId: string; // ID del destinatario (puede ser usuario o admin)
  recipientType: RecipientTypes; // Tipo de destinatario (user/admin)
  type: NotificationTypes; // Tipo de notificación (user_request/admin_message)
  message: string; // El mensaje de la notificación
  title: string;
  summary: string;
  status: StatusCodes; // Estado de la notificación (pending, read, unread, etc.)
  fieldToUpdate?: string; // El campo que se solicita modificar
  newValue?: any; // El nuevo valor propuesto para ese campo
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Fecha de última actualización
}

// Esquema de notificación de Mongoose
const notificationSchema = new Schema<INotification>({
  recipientId: {
    type: String,
    required: true,
  },
  recipientType: {
    type: String,
    enum: Object.values(RecipientTypes),
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(NotificationTypes),
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: Object.values(StatusCodes),
    default: StatusCodes.UNREAD, // Estado por defecto será "unread"
    required: true,
  },
  fieldToUpdate: {
    type: String, // Almacenará el nombre del campo que se solicita modificar
    required: false, // Opcional
  },
  newValue: {
    type: Schema.Types.Mixed, // Puede ser cualquier tipo de dato, dependiendo del campo que se esté actualizando
    required: false, // Opcional
  },
  createdAt: {
    type: Date,
    default: Date.now, // Fecha de creación por defecto
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Actualizará cada vez que se guarde
  },
});

// Hook `pre` para actualizar `updatedAt` antes de guardar
notificationSchema.pre<INotification>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Crear el modelo de notificación basado en el esquema
const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
export { INotification };
