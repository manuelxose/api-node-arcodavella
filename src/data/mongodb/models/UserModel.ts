import { Schema, model, Document, Types } from "mongoose";
import { UserRoles } from "../../../domain/enums/UserRoles"; // Importar el enum de roles
import { BcryptAdapter as bcrypt } from "../../../core/adapters";

// Interfaz que define la estructura del documento de usuario en MongoDB
interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  img?: string;
  role: UserRoles;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Esquema de usuario de Mongoose
const userSchema = new Schema<IUser>({
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
  img: {
    type: String,
  },
  role: {
    type: String,
    default: UserRoles.User,
    enum: Object.values(UserRoles),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hook `pre` para el guardado del usuario: Hashear la contraseña si ha sido modificada
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash de la contraseña usando el método hash directamente
    this.password = await bcrypt.hash(this.password);
    this.updatedAt = new Date();
    next();
  } catch (err: any) {
    next(err);
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
export { IUser };
