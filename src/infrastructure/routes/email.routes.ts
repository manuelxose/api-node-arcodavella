import { Router } from "express";
import { EmailController } from "../controllers";
import { NodemailerEmailDataSource } from "../datasources";
import { EmailRepository } from "../../domain/repositories";
import { NodemailerEmailRepository } from "../repositories";
import { SendEmailUseCase } from "../../application/use-cases/email/send-email.use-case";

export class EmailRoutes {
  public router: Router;
  private controller: EmailController; // Declaración sin inicialización
  private emailDataSource!: NodemailerEmailDataSource; // Usando '!' para aserción de asignación
  private emailRepository!: EmailRepository; // Usando '!' para aserción de asignación

  //Casos de uso

  private sendEmailUseCase!: SendEmailUseCase;

  constructor() {
    this.router = Router();
    this.controller = this.initializeController();
    this.initializeRoutes();
  }

  private initializeController(): EmailController {
    // Configuracion de DataSource y Repository
    this.emailDataSource = new NodemailerEmailDataSource();
    this.emailRepository = new NodemailerEmailRepository(this.emailDataSource);
    //Configuracion de los casos de uso

    this.sendEmailUseCase = new SendEmailUseCase(this.emailRepository);
    return new EmailController(this.sendEmailUseCase);
  }

  private initializeRoutes() {
    this.router.post("/send", this.controller.sendEmail);
  }
}

export default new EmailRoutes().router;
