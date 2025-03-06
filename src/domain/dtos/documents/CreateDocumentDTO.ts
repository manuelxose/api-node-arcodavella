import { Validators } from "../../../shared";
import { CustomError } from "../../errors";
import { DocumentType } from "../../enums";

/**
 * DTO para la creación de un documento.
 */
export class CreateDocumentDTO {
  public readonly title: string;
  public readonly description: string;
  public readonly userId: string;
  public readonly type: DocumentType;
  public readonly url?: string;
  public readonly file?: string;
  public readonly createdAt?: Date;

  private constructor(
    title: string,
    description: string,
    userId: string,
    type: DocumentType,
    url?: string,
    file?: string,
    createdAt?: Date
  ) {
    this.title = title;
    this.description = description;
    this.userId = userId;
    this.type = type;
    this.url = url;
    this.file = file;
    this.createdAt = createdAt || new Date()
  }

  /**
   * Crea una instancia de CreateDocumentDTO validando los campos requeridos.
   * @param data - Objeto con los datos para crear el documento.
   * @returns Tupla con [error, instancia] donde error es nulo si la validación fue exitosa.
   */
  static create(data: {
    title: string;
    description: string;
    userId: string;
    type: DocumentType;
    url?: string;
    file?: string;
    createdAt?: Date;
  }): [CustomError | null, CreateDocumentDTO | null] {
    const validationError = this.validateFields(data);
    if (validationError) {
      return [validationError, null];
    }
    return [
      null,
      new CreateDocumentDTO(data.title, data.description, data.userId, data.type, data.url, data.file),
    ];
  }

  private static validateFields(data: {
    title: string;
    description: string;
    userId: string;
    type: DocumentType;
  }): CustomError | null {
    if (!Validators.isNotEmpty(data.title)) {
      return CustomError.badRequest("Title is required");
    }
    if (!Validators.isNotEmpty(data.description)) {
      return CustomError.badRequest("Description is required");
    }
    if (!Validators.isNotEmpty(data.userId)) {
      return CustomError.badRequest("User ID is required");
    }
    // Se puede agregar validación para 'type' si se requiere
    return null;
  }
}
