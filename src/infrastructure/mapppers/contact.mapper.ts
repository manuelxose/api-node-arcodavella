// src/infrastructure/mappers/ContactoMapper.ts

import { IContacto } from "../../data/mongodb/models";
import { ContactoEntity } from "../../domain/entities/contact/ContactEntity";

export class ContactoMapper {
  static toEntity(contacto: IContacto): ContactoEntity {
    return ContactoEntity.create({
      id: contacto._id.toString(),
      nombre: contacto.nombre,
      correo: contacto.correo,
      telefono: contacto.telefono,
      fechaRegistro: contacto.fechaRegistro,
      activo: contacto.activo,
    });
  }
}
