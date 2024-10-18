// src/data/mongodb/models/contacto.model.ts

import mongoose, { Document, Schema, Types } from "mongoose";

export interface IContacto extends Document {
  _id: Types.ObjectId; // Aseguramos que _id tenga un tipo conocido
  nombre: string;
  correo: string;
  telefono: string;
  fechaRegistro: Date;
  activo: boolean;
}

const ContactoSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
});

const ContactoModel = mongoose.model<IContacto>("Contacto", ContactoSchema);

export default ContactoModel;
