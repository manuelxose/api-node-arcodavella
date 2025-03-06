import { DocumentType } from '../../enums';



class DocumentEntity {
  id: string;
  userId: string;
  type: DocumentType;
  title: string;
  description: string;
  url: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    type: DocumentType,
    title: string,
    description: string,
    url: string,
    file: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.description = description;
    this.url = url;
    this.file = file;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Metodo para crear una entidad de documento
  static create(data: DocumentEntity): DocumentEntity {
    return new DocumentEntity(
      data.id,
      data.userId,
      data.type,
      data.title,
      data.description,
      data.url,
      data.file,
      data.createdAt,
      data.updatedAt
    );
  }


}

export default DocumentEntity;
