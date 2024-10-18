import { UnsubscribeContactoDTO } from "../../../domain/dtos/contact";
import { ContactoRepository } from "../../../domain/repositories/contact.repository";

export class UnsuscribeContactsUseCase {
  constructor(private readonly contactRepository: ContactoRepository) {}
  async execute(dto: UnsubscribeContactoDTO): Promise<void> {
    return this.contactRepository.unsubscribeContacto(dto.correo);
  }
}
