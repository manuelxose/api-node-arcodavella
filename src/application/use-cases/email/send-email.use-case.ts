import { SendEmailDTO } from "../../../domain/dtos/email";
import { EmailRepository } from "../../../domain/repositories";
import logger from "../../../core/adapters/logger"; // Asegúrate de tener un logger configurado
import { CustomError } from "../../../domain/errors";

export class SendEmailUseCase {
  constructor(private emailRepository: EmailRepository) {}

  async execute(sendEmailDTO: SendEmailDTO): Promise<void> {
    try {
      await this.emailRepository.sendEmail(sendEmailDTO);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al enviar el correo: ${error.message}`);
        // Puedes transformar el error o lanzar uno nuevo si es necesario
        throw CustomError.badRequest("Failed to send email");
      }
      // Manejo de errores no estándar
      logger.error("Error desconocido al enviar el correo.");
      throw CustomError.badRequest(
        "Unknown error occurred while sending email"
      );
    }
  }
}
