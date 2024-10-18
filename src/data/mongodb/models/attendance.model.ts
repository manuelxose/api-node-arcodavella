import mongoose, { Schema, Document } from "mongoose";

// Definimos una interfaz para el documento de asistencia en MongoDB
export interface AttendanceDocument extends Document {
  name: string;
  email: string;
  dni: string;
  memberNumber: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  entry: string;
}

// Definimos el esquema de Mongoose para la colección "attendance"
const AttendanceSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dni: { type: String, required: true },
  memberNumber: { type: String, required: true },
  date: { type: Date, required: true },
  entry: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Creamos el modelo de asistencia a partir del esquema
const AttendanceModel = mongoose.model<AttendanceDocument>(
  "Attendance",
  AttendanceSchema
);

export default AttendanceModel;
