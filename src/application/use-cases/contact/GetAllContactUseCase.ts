import { ContactoEntity } from "../../../domain/entities/contact/ContactEntity";
import { ContactoRepository } from "../../../domain/repositories/contact.repository";

export class GetAllContactUseCase {
  constructor(private readonly contactRepository: ContactoRepository) {}

  async execute(): Promise<ContactoEntity[]> {
    return this.contactRepository.getAll();
  }
}
