import { Router } from "express";
import { DocumentsController } from "../controllers";
import { StorageRepositoryFactory } from "../factories";
import { DocumentMongoDBDataSource } from "../datasources";
import { DocumentRepository } from "../repositories";

export class DocumentsRoutes {
  //Declaración del Router
  public router: Router;

  // Declaracion de casos de usos, siempre van a ser por UserID

  //Declaración de controladores

  private documentController: DocumentsController;

  //Declaración de repositorios

  private documentRepository: DocumentRepository;
  private storageRepository: StorageRepositoryFactory;

  //Declaración de datasources

  private documentDataSource: DocumentMongoDBDataSource;

  /**
   * Constructor de DocumentsRoutes
   *
   * Inicializa las dependencias y configura las rutas.
   */

  constructor() {
    this.router = Router();

    this.documentDataSource = new DocumentMongoDBDataSource();
    this.storageRepository = new StorageRepositoryFactory();

    this.documentRepository = new DocumentRepository(this.documentDataSource);

    this.storageRepository = new StorageRepositoryFactory(); //By deffault it will be drive

    //Inicialización de los casos de uso con sus respectivas dependencias

    //Inicialización del controlador con los casos de uso

    this.documentController = new DocumentsController(
      this.documentRepository,
      this.storageRepository
    );

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/upload", this.documentController.upload);
    this.router.get("/get/:id", this.documentController.getById);
    this.router.delete("/delete/:id", this.documentController.delete);
    this.router.get("/all/:userId", this.documentController.getAll);
  }
}

export default new DocumentsRoutes().router;
