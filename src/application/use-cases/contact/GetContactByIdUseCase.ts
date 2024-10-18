import { GetContactByIdDTO } from "../../../domain/dtos/contact";
import { ContactoRepository } from "../../../domain/repositories/contact.repository";

export class GetContactUseCase {
  constructor(private readonly contactRepository: ContactoRepository) {}

  async execute(dto: GetContactByIdDTO) {
    return this.contactRepository.getContactoById(dto);
  }
}
