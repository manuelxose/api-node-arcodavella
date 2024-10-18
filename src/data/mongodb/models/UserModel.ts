import { Schema, model, Document, Types } from "mongoose";
import { UserRoles, StatusCodes } from "../../../domain/enums";
import { BcryptAdapter as bcrypt } from "../../../core/adapters";

// Interfaz que define la estructura del documento de usuario en MongoDB
interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  username?: string;
  password: string;
  memberNumberStatus: StatusCodes; // Estado del número de socio
  memberNumber?: string | null;
  name?: string;
  img?: string;
  role: UserRoles;
  status: StatusCodes;
  phone?: string; // Teléfono del usuario
  address?: string; // Dirección del usuario
  accountNumber?: string; // Número de cuenta del usuario
  dni?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Esquema de usuario de Mongoose
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    memberNumber: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      default: null, // No asignado por defecto
    },
    memberNumberStatus: {
      type: String,
      enum: Object.values(StatusCodes),
      default: StatusCodes.UNASSIGNED,
    },
    img: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: UserRoles.USER,
      enum: Object.values(UserRoles),
    },
    status: {
      type: String,
      default: StatusCodes.PENDING,
      enum: Object.values(StatusCodes),
    },
    phone: {
      type: String, // Teléfono del usuario
      required: false,
      trim: true,
    },
    address: {
      type: String, // Dirección del usuario
      required: false,
      trim: true,
    },
    accountNumber: {
      type: String, // Número de cuenta del usuario
      required: false,
      trim: true,
    },
    name: { type: String, required: false, trim: true },
    dni: { type: String, required: false, trim: true },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Hook pre para el guardado del usuario: Hashear la contraseña si ha sido modificada
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.updatedAt = new Date();
    next();
  } catch (err: unknown) {
    if (err instanceof Error) next(err);
  }
});

// Método de instancia para comparar contraseñas
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Crear el modelo de usuario
const UserModel = model<IUser>("User", userSchema);

export default UserModel;
export { IUser, StatusCodes };
