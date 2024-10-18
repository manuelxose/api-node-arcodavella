import { Schema, model, Document, Types } from "mongoose";

// Interfaz que define la estructura del documento de socio en MongoDB
interface IMember extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  dni: string;
  memberNumber: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: string; // Asegúrate de que comments esté aquí
  img?: string;
}

// Esquema de socio de Mongoose
const memberSchema = new Schema<IMember>({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  //El correo no puede ser unico por que puede que varios socios tengan mismo correo

  email: {
    type: String,
    required: true,
    unique: false,
    lowercase: true,
    trim: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  memberNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  comments: {
    // Asegúrate de que `comments` esté correctamente definido
    type: String,
    trim: true,
  },
  img: {
    type: String,
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

// Hook `pre` para actualizar `updatedAt` antes de guardar cambios
memberSchema.pre<IMember>("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Crear el modelo de socio
const MemberModel = model<IMember>("Member", memberSchema);

export default MemberModel;
export { IMember };
