import { Router } from "express";
import { LogController } from "../controllers/log.controller";
import { MongoLogsDatasource } from "../datasources/logs.mongodb.datasource";
import { LogRepository } from "../repositories";

export class LogRoutes {
  private router: Router;
  private logController: LogController;

  constructor() {
    this.router = Router();

    // Crear instancias de DataSources
    const logDataSource = new MongoLogsDatasource();

    // Crear instancias de Repositories
    const logRepository = new LogRepository(logDataSource);

    // Crear instancia del controlador de registro de logins
    this.logController = new LogController(logRepository);

    // Configurar rutas con middleware
    this.initializeRoutes();
  }

  /**
   * Inicializa las rutas de registro de logins.
   */
  private initializeRoutes(): void {
    // Ruta para obtener los registros de login por email
    this.router.get(
      "/logs",
      this.logController.getLogsByEmail.bind(this.logController)
    );

    // Ruta para obtener todos los registros de login
    this.router.get("/all", this.logController.getAll.bind(this.logController));
  }

  /**
   * Retorna el objeto Router configurado.
   * @returns Router
   */
  public getRoutes(): Router {
    return this.router;
  }
}

const logRoutesInstance = new LogRoutes();
const router = logRoutesInstance.getRoutes();

export { router };
