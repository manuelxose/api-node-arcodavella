import { Validators } from "../../../shared";
import { CustomError } from "../../errors";
import { DocumentType } from "../../enums";

/**
 * DTO para la actualización de un documento.
 */
export class UpdateDocumentDTO {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly userId: string;
  public readonly type: DocumentType;
  public readonly url: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(
    id: string,
    title: string,
    description: string,
    userId: string,
    type: DocumentType,
    url: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.userId = userId;
    this.type = type;
    this.url = url;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Crea una instancia de UpdateDocumentDTO validando los campos requeridos.
   * @param data - Objeto con los datos para actualizar el documento.
   * @returns Tupla con [error, instancia] donde error es nulo si la validación fue exitosa.
   */
  static create(data: {
    id: string;
    title: string;
    description: string;
    userId: string;
    type: DocumentType;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }): [CustomError | null, UpdateDocumentDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }
    return [
      null,
      new UpdateDocumentDTO(
        data.id,
        data.title,
        data.description,
        data.userId,
        data.type,
        data.url,
        data.createdAt,
        data.updatedAt
      ),
    ];
  }

  private static validateFields(data: {
    id: string;
    title: string;
    description: string;
    userId: string;
    type: DocumentType;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.id)) {
      return CustomError.badRequest("ID is required");
    }
    if (!Validators.isNotEmpty(data.title)) {
      return CustomError.badRequest("Title is required");
    }
    if (!Validators.isNotEmpty(data.description)) {
      return CustomError.badRequest("Description is required");
    }
    if (!Validators.isNotEmpty(data.userId)) {
      return CustomError.badRequest("User ID is required");
    }
    if (!Validators.isNotEmpty(data.url)) {
      return CustomError.badRequest("URL is required");
    }
    if (!data.createdAt) {
      return CustomError.badRequest("createdAt is required");
    }
    if (!data.updatedAt) {
      return CustomError.badRequest("updatedAt is required");
    }
    // Se puede agregar validación adicional para 'type' si es necesario.
    return null;
  }
}
