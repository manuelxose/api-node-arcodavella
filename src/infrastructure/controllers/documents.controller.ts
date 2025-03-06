import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.errors";
import logger from "../../core/adapters/logger";
import {
  CreateDocumentUseCase,
  UpdateDocumentUseCase,
  DeleteDocumentUseCase,
  GetDocumentByUserIdUseCase,
  GetAllDocumentByUSerIDUseCase,
} from "../../application/use-cases/documents";
import {
  CreateDocumentDTO,
  UpdateDocumentDTO,
  DeleteDocumentDTO,
  GetDocumentByUserIDDTO,
} from "../../domain/dtos/documents";
import { DocumentRepository } from "../repositories";
import { StorageRepositoryFactory } from "../factories";

/**
 * Controller for handling document-related operations.
 * Responsible for validating input, invoking use cases, and returning appropriate responses.
 */
export class DocumentsController {
  private createDocument: CreateDocumentUseCase;
  private updateDocument: UpdateDocumentUseCase;
  private deleteDocument: DeleteDocumentUseCase;
  private getDocumentById: GetDocumentByUserIdUseCase;
  private getAllDocuments: GetAllDocumentByUSerIDUseCase;

  /**
   * Initializes the controller with necessary use cases.
   * @param documentRepository Repository for document data access.
   */
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly storageRepository: StorageRepositoryFactory
  ) {
    this.createDocument = new CreateDocumentUseCase(this.documentRepository);
    this.updateDocument = new UpdateDocumentUseCase(this.documentRepository);
    this.deleteDocument = new DeleteDocumentUseCase(this.documentRepository);
    this.getDocumentById = new GetDocumentByUserIdUseCase(
      this.documentRepository
    );
    this.getAllDocuments = new GetAllDocumentByUSerIDUseCase(
      this.documentRepository
    );
  }

  /**
   * Handles errors by logging and returning appropriate HTTP responses.
   * @param error The error object to handle.
   * @param res Express response object.
   */
  private handleError(error: unknown, res: Response): void {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Creates a new document.
   * @param req Express request object.
   * @param res Express response object.
   */
  public async upload(req: Request, res: Response): Promise<void> {
    const [error, createDocumentDTO] = CreateDocumentDTO.create(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    try {
      const response = await this.createDocument.execute(createDocumentDTO!);
      res.status(201).json(response);
    } catch (err) {
      this.handleError(err, res);
    }
  }

  /**
   * Updates an existing document.
   * @param req Express request object.
   * @param res Express response object.
   */
  public async update(req: Request, res: Response): Promise<void> {
    const [error, updateDocumentDTO] = UpdateDocumentDTO.create({
      id: req.params.id,
      ...req.body,
    });
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    try {
      const document = await this.updateDocument.execute(updateDocumentDTO!);
      res.status(200).json(document);
    } catch (err) {
      this.handleError(err, res);
    }
  }

  /**
   * Deletes a document by ID.
   * @param req Express request object.
   * @param res Express response object.
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const [error, deleteDocumentDTO] = DeleteDocumentDTO.create({
      id: req.params.id,
      userId: req.body.userId,
    });
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    try {
      await this.deleteDocument.execute(deleteDocumentDTO!);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      this.handleError(err, res);
    }
  }

  /**
   * Retrieves a document by ID.
   * @param req Express request object.
   * @param res Express response object.
   */
  public async getById(req: Request, res: Response): Promise<void> {
    const [error, getDocumentByIdDTO] = GetDocumentByUserIDDTO.create({
      userId: req.params.id,
    });
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    try {
      const document = await this.getDocumentById.execute(getDocumentByIdDTO!);
      if (!document) {
        res.status(404).json({ error: "Document not found" });
        return;
      }
      res.status(200).json(document);
    } catch (err) {
      this.handleError(err, res);
    }
  }

  /**
   * Retrieves all documents, optionally filtered by member ID.
   * @param req Express request object.
   * @param res Express response object.
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    const [error, getDocumentByUserIDDTO] = GetDocumentByUserIDDTO.create({
      userId: req.params.id,
    });
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    try {
      const documents = await this.getAllDocuments.execute(
        getDocumentByUserIDDTO!
      );
      res.status(200).json(documents);
    } catch (err) {
      this.handleError(err, res);
    }
  }
}
