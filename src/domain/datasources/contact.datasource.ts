// src/domain/datasources/contacto.datasource.ts

import { ContactoEntity } from "../entities/contact/ContactEntity";

export abstract class ContactoDataSource {
  abstract create(contacto: ContactoEntity): Promise<ContactoEntity>;
  abstract findByEmail(email: string): Promise<ContactoEntity | null>;
  abstract update(contacto: ContactoEntity): Promise<ContactoEntity>;
  abstract findById(id: string): Promise<ContactoEntity>;
  abstract findAll(): Promise<ContactoEntity[]>;
}
