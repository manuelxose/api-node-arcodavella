// src/infrastructure/repositories/contacto.repository.ts

import { ContactoDataSource } from "../../domain/datasources/contact.datasource";
import { GetContactByIdDTO } from "../../domain/dtos/contact";
import { ContactoEntity } from "../../domain/entities/contact/ContactEntity";
import { ContactoRepository } from "../../domain/repositories/contact.repository";

export class ContactMongoRepository extends ContactoRepository {
  constructor(private dataSource: ContactoDataSource) {
    super();
  }

  async addContacto(contacto: ContactoEntity): Promise<ContactoEntity> {
    return this.dataSource.create(contacto);
  }

  async getContactoByEmail(email: string): Promise<ContactoEntity | null> {
    return this.dataSource.findByEmail(email);
  }

  async unsubscribeContacto(email: string): Promise<void> {
    const contacto = await this.dataSource.findByEmail(email);
    if (!contacto) {
      throw new Error("Contacto no encontrado");
    }
    contacto.activo = false;
    await this.dataSource.update(contacto);
  }

  async getContactoById(dto: GetContactByIdDTO): Promise<ContactoEntity> {
    return this.dataSource.findById(dto.id);
  }

  async getAll(): Promise<ContactoEntity[]> {
    return this.dataSource.findAll();
  }
}
