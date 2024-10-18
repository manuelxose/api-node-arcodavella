import { FetchContactsUseCase } from "../../application/use-cases/contact/FetchContacts.use-case";
import { ContactMongoRepository } from "../../infrastructure/repositories/contact.repository";
import { ContactMongodataSource } from "../../infrastructure/datasources";
import { ImapAdapter } from "../../core/adapters/imap";
import { CronAdapter } from "../../core/adapters/cron";
import { CustomError } from "../../domain/errors";

export class FetchContactsCron {
  private iamAdapter: ImapAdapter;
  private dataSource: ContactMongodataSource;
  private contactoRepository: ContactMongoRepository;
  private fetchContactUseCase: FetchContactsUseCase;
  private cronAdapter: CronAdapter;

  constructor() {
    this.cronAdapter = new CronAdapter();
    this.iamAdapter = new ImapAdapter();
    this.dataSource = new ContactMongodataSource();
    this.contactoRepository = new ContactMongoRepository(this.dataSource);
    this.fetchContactUseCase = new FetchContactsUseCase(
      this.contactoRepository,
      this.iamAdapter
    );
  }

  scheduleTask() {
    console.log("Iniciando la tarea cron para FetchContacts");

    // Programar la tarea cron
    this.cronAdapter
      .scheduleTask("0 0 * * *", async () => {
        console.log("Ejecutando el caso de uso FetchContacts");
        try {
          await this.fetchContactUseCase.execute();
          console.log("FetchContacts ejecutado con éxito");
        } catch (error: unknown) {
          if (error instanceof CustomError) {
            console.error(`Error en FetchContacts: ${error.message}`);
          } else {
            console.error(`Error en FetchContacts: ${error}`);
          }
        }
      })
      .start();
  }
}
