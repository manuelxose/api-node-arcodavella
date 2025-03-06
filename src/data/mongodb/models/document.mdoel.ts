import { Schema, model, Document } from "mongoose";

export interface IDocument extends Document {
  userId: string;
  type: string;
  title: string;
  description: string;
  url: string;
  file: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema({
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
    type: Buffer,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const DocumentModel = model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
