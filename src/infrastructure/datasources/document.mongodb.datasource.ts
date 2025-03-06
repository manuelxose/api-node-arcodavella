/**
 * Fuente de datos para la gestión de documentos en MongoDB.
 * Implementa la interfaz DocumentDataSource para proveer
 * las operaciones CRUD sobre el modelo de documento.
 */
import logger from "../../core/adapters/logger";
import DocumentModel from "../../data/mongodb/models/document.model";
import { DocumentDataSource } from "../../domain/datasources";
import {
  CreateDocumentDTO,
  DeleteDocumentDTO,
  GetDocumentByIdDTO,
  GetDocumentByUserIDDTO,
  UpdateDocumentDTO,
} from "../../domain/dtos/documents";
import DocumentEntity from "../../domain/entities/document/DocumentEntity";
import { CustomError } from "../../domain/errors";
import { DocumentMapper } from "../mapppers/document.mapper";

export class DocumentMongoDBDataSource implements DocumentDataSource {
  /**
   * Crea un nuevo documento en la base de datos.
   * @param createDocumentDTO - Datos del documento a crear.
   * @returns La entidad DocumentEntity creada.
   * @throws CustomError.badRequest si ya existe un documento similar.
   */
  async create(createDocumentDTO: CreateDocumentDTO): Promise<DocumentEntity> {
    try {
      // Se verifica si ya existe un documento con el mismo userId y tipo
      const existingDocument = await DocumentModel.findOne({
        userId: createDocumentDTO.userId,
      });

      if (existingDocument) {
        logger.warn(
          `El documento con tipo "${createDocumentDTO.type}" para el usuario "${createDocumentDTO.userId}" ya existe.`
        );
        throw CustomError.badRequest("Documento ya existe");
      }

      // Se crea una nueva instancia del modelo con los datos proporcionados
      const newDocument = new DocumentModel({
        userId: createDocumentDTO.userId,
        type: createDocumentDTO.type,
        title: createDocumentDTO.title,
        description: createDocumentDTO.description,
        url: createDocumentDTO.url,
        file: createDocumentDTO.file,
        createdAt: createDocumentDTO.createdAt || new Date(),
      });

      // Se guarda el documento en la base de datos
      const savedDocument = await newDocument.save();
      logger.info(`Documento creado con ID: ${savedDocument._id}`);
      return DocumentMapper.toEntity(savedDocument);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al crear documento: ${error.message}`);
      } else {
        logger.error(`Error inesperado al crear documento: ${error}`);
      }
      throw CustomError.internal("Error al crear documento");
    }
  }

  /**
   * Busca un documento por su ID.
   * @param id - ID del documento a buscar.
   * @returns La entidad DocumentEntity si se encuentra, o null en caso contrario.
   * @throws CustomError.internal en caso de error en la consulta.
   */
  async getById(id: GetDocumentByIdDTO): Promise<DocumentEntity | null> {
    try {
      const document = await DocumentModel.findById(id);
      if (!document) {
        logger.warn(`Documento con ID "${id}" no encontrado.`);
        return null;
      }
      logger.info(`Documento encontrado: ${document._id}`);
      return DocumentMapper.toEntity(document);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al buscar documento: ${error.message}`);
      } else {
        logger.error(`Error inesperado al buscar documento: ${error}`);
      }
      throw CustomError.internal("Error al buscar documento");
    }
  }

  /**
   * Actualiza un documento existente.
   * @param updateDocumentDTO - Datos actualizados del documento.
   * @returns La entidad DocumentEntity actualizada.
   * @throws CustomError.notFound si no se encuentra el documento.
   * @throws CustomError.badRequest para errores de validación.
   */
  async update(updateDocumentDTO: UpdateDocumentDTO): Promise<DocumentEntity> {
    try {
      const updatedDocument = await DocumentModel.findOneAndUpdate(
        { _id: updateDocumentDTO.id },
        {
          userId: updateDocumentDTO.userId,
          type: updateDocumentDTO.type,
          title: updateDocumentDTO.title,
          description: updateDocumentDTO.description,
          url: updateDocumentDTO.url,
          createdAt: updateDocumentDTO.createdAt,
          updatedAt: updateDocumentDTO.updatedAt || new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!updatedDocument) {
        logger.warn(
          `Documento con ID "${updateDocumentDTO.id}" no encontrado para actualizar.`
        );
        throw CustomError.notFound("Documento no encontrado");
      }

      logger.info(`Documento actualizado: ${updatedDocument._id}`);
      return DocumentMapper.toEntity(updatedDocument);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al actualizar documento: ${error.message}`);
        if (error.name === "ValidationError") {
          throw CustomError.badRequest("Datos de documento inválidos");
        }
      } else {
        logger.error(`Error inesperado al actualizar documento: ${error}`);
      }
      throw CustomError.internal("Error al actualizar documento");
    }
  }

  /**
   * Recupera todos los documentos.
   * @returns Una lista de entidades DocumentEntity.
   * @throws CustomError.notFound si no se encuentran documentos.
   */
  async getAll(): Promise<DocumentEntity[]> {
    try {
      const documents = await DocumentModel.find();
      if (!documents || documents.length === 0) {
        throw CustomError.notFound("No se encontraron documentos");
      }
      return documents.map(DocumentMapper.toEntity);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al recuperar documentos: ${error.message}`);
        throw CustomError.internal("Error al recuperar documentos");
      } else {
        logger.error(`Error inesperado: ${error}`);
        throw CustomError.internal("Ocurrió un error inesperado");
      }
    }
  }

  /**
   * Elimina un documento por su ID.
   * @param id - ID del documento a eliminar.
   * @throws CustomError.notFound si no se encuentra el documento.
   */
  async delete(id: DeleteDocumentDTO): Promise<void> {
    try {
      const deletedDocument = await DocumentModel.findOneAndDelete({ _id: id });
      if (!deletedDocument) {
        logger.warn(`Documento con ID "${id}" no encontrado para eliminar.`);
        throw CustomError.notFound("Documento no encontrado");
      }
      logger.info(`Documento eliminado: ${deletedDocument._id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al eliminar documento: ${error.message}`);
      } else {
        logger.error(`Error inesperado al eliminar documento: ${error}`);
      }
      throw CustomError.internal("Error al eliminar documento");
    }
  }

  /**
   * Busca documentos asociados a un ID de usuario.
   * @param id - ID del usuario.
   * @returns Una lista de entidades DocumentEntity pertenecientes al usuario.
   * @throws CustomError.notFound si no se encuentran documentos para el usuario.
   */
  async getByUserId(id: GetDocumentByUserIDDTO): Promise<DocumentEntity[]> {
    try {
      const documents = await DocumentModel.find({ userId: id });
      if (!documents || documents.length === 0) {
        throw CustomError.notFound(
          "No se encontraron documentos para el usuario"
        );
      }
      return documents.map((document) => DocumentMapper.toEntity(document));
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `Error al buscar documentos por usuario: ${error.message}`
        );
        throw CustomError.internal("Error al buscar documentos por usuario");
      } else {
        logger.error(`Error inesperado: ${error}`);
        throw CustomError.internal("Ocurrió un error inesperado");
      }
    }
  }
}
