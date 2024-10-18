import { SendEmailDTO } from "../../../domain/dtos/email";
import { EmailRepository } from "../../../domain/repositories";

export class SendEmailUseCase {
  constructor(private emailRepository: EmailRepository) {}
  async execute(sendEmailDTO: SendEmailDTO): Promise<void> {
    try {
      await this.emailRepository.sendEmail(sendEmailDTO);
    } catch (error) {
      throw error;
    }
  }
}
