import DocumentEntity from "../../domain/entities/document/DocumentEntity";
import { DocumentType } from "../../domain/enums";

// Se actualiza el DTO para aceptar string o DocumentType en la propiedad "type".
interface DocumentDTO {
  id: string;
  userId: string;
  type: DocumentType | string; // Se acepta string para los datos provenientes de la DB
  title: string;
  description: string;
  url: string;
  file: string; // Se espera un string que representa la ruta/URL del archivo
  createdAt: Date;
  updatedAt: Date;
}

export class DocumentMapper {
  /**
   * Transforma un objeto parcial de DocumentDTO en una instancia de DocumentEntity.
   * Se convierte la propiedad "type" a DocumentType.
   * @param data - Datos parciales del documento.
   * @returns Instancia de DocumentEntity.
   */
  static toEntity(data: Partial<DocumentDTO>): DocumentEntity {
    // Convertir la propiedad "type" de string a DocumentType, usando DEFAULT si es necesario
    const type: DocumentType =
      typeof data.type === "string"
        ? (data.type as DocumentType)
        : data.type || DocumentType.DEFAULT;

    return DocumentEntity.create({
      id: data.id || "",
      userId: data.userId || "",
      type,
      title: data.title || "",
      description: data.description || "",
      url: data.url || "",
      file: data.file || "",
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    });
  }
}
