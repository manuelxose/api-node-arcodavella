// src/infrastructure/models/LoginLogModel.ts

import { Schema, model, Document, Types } from "mongoose";
import { StatusCodes } from "../../../domain/enums";
import { BcryptAdapter as bcrypt } from "../../../core/adapters"; // Asegúrate de que esta ruta sea correcta

// Interfaz que define la estructura del documento de registro de login en MongoDB
interface ILoginLog extends Document {
  _id: Types.ObjectId;
  email: string;
  ipAddress: string;
  timestamp: Date;

  // Método de instancia si se requiere
  // compareSomething?: () => boolean;
}

// Esquema de registro de login de Mongoose
const loginLogSchema = new Schema<ILoginLog>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  ipAddress: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
loginLogSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

// Crear el modelo de registro de login
const LoginLogModel = model<ILoginLog>("LoginLog", loginLogSchema);

export default LoginLogModel;
export { ILoginLog };
