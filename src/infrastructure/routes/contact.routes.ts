import { Router } from "express";
import { ContactoRepository } from "../../domain/repositories/contact.repository";
import { ContactController } from "../controllers";
import { ContactoDataSource } from "../../domain/datasources/contact.datasource";
import { ContactMongoRepository } from "../repositories/contact.repository";
import { ContactMongodataSource } from "../datasources";
import {
  FetchContactsUseCase,
  GetAllContactUseCase,
  GetContactUseCase,
  UnsuscribeContactsUseCase,
} from "../../application/use-cases/contact";
import { ImapAdapter } from "../../core/adapters/imap";

/**
 * Clase ContactRoutes
 *
 * Esta clase define y configura las rutas relacionadas con los contactos.
 * Utiliza el patrón de controlador para manejar las solicitudes HTTP.
 */
class ContactRoutes {
  private router: Router;

  // Instancias de los componentes necesarios
  private contactController: ContactController;
  private contactRepository: ContactoRepository;
  private contactDataSource: ContactoDataSource;
  private imapAdapter: ImapAdapter;

  // Instancias de los casos de uso
  private fetchContactUseCase: FetchContactsUseCase;
  private unsuscribeContactUseCase: UnsuscribeContactsUseCase;
  private getContactUseCase: GetContactUseCase;
  private getAllContactUseCase: GetAllContactUseCase;

  /**
   * Constructor de ContactRoutes
   *
   * Inicializa las dependencias y configura las rutas.
   */
  constructor() {
    this.router = Router();

    // Inicialización de adaptadores y fuentes de datos
    this.imapAdapter = new ImapAdapter();
    this.contactDataSource = new ContactMongodataSource();
    this.contactRepository = new ContactMongoRepository(this.contactDataSource);

    // Inicialización de los casos de uso con sus respectivas dependencias
    this.fetchContactUseCase = new FetchContactsUseCase(
      this.contactRepository,
      this.imapAdapter
    );
    this.unsuscribeContactUseCase = new UnsuscribeContactsUseCase(
      this.contactRepository
    );
    this.getContactUseCase = new GetContactUseCase(this.contactRepository);
    this.getAllContactUseCase = new GetAllContactUseCase(
      this.contactRepository
    );

    // Inicialización del controlador con los casos de uso
    this.contactController = new ContactController(
      this.fetchContactUseCase,
      this.unsuscribeContactUseCase,
      this.getContactUseCase,
      this.getAllContactUseCase
    );

    // Configuración de las rutas
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/all", this.contactController.getAll);
    this.router.post("/subscribe", this.contactController.subscribe);
    this.router.post("/unsubscribe", this.contactController.unsubscribe);
    this.router.post("/fetch", this.contactController.fetch);
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export default new ContactRoutes().getRoutes();
