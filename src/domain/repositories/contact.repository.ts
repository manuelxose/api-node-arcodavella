// src/domain/repositories/contacto.repository.ts

import { GetContactByIdDTO } from "../dtos/contact";
import { ContactoEntity } from "../entities/contact/ContactEntity";

export abstract class ContactoRepository {
  abstract addContacto(contacto: ContactoEntity): Promise<ContactoEntity>;
  abstract getContactoByEmail(email: string): Promise<ContactoEntity | null>;
  abstract unsubscribeContacto(email: string): Promise<void>;
  abstract getContactoById(dto: GetContactByIdDTO): Promise<ContactoEntity>;
  abstract getAll(): Promise<ContactoEntity[]>;
}
