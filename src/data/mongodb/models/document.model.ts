import { Schema, model, Document } from "mongoose";

export interface IDocument extends Document {
  userId: string;
  type: string;
  title: string;
  description: string;
  url: string;
  file: string; // Cambiado de Buffer a string
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Genera automáticamente createdAt y updatedAt
  }
);

const DocumentModel = model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
