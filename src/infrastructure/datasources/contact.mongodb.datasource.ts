// src/infrastructure/datasources/ContactMongodataSource.ts

import logger from "../../core/adapters/logger";
import ContactoModel from "../../data/mongodb/models/contact.model";
import { ContactoDataSource } from "../../domain/datasources/contact.datasource";
import { ContactoEntity } from "../../domain/entities/contact/ContactEntity";
import { CustomError } from "../../domain/errors";
import { ContactoMapper } from "../mapppers/contact.mapper";

export class ContactMongodataSource implements ContactoDataSource {
  // Crear un nuevo contacto
  async create(contacto: ContactoEntity): Promise<ContactoEntity> {
    try {
      // Verificar si el contacto ya existe por correo electrónico
      const existingContacto = await ContactoModel.findOne({
        correo: contacto.correo,
      });

      if (existingContacto) {
        logger.warn(`Contacto con correo ${contacto.correo} ya existe.`);
        throw CustomError.badRequest("Contacto ya existe");
      }

      // Crear y guardar el nuevo contacto en MongoDB
      const newContacto = new ContactoModel({
        nombre: contacto.nombre,
        correo: contacto.correo,
        telefono: contacto.telefono,
        fechaRegistro: contacto.fechaRegistro,
        activo: contacto.activo,
      });

      const savedContacto = await newContacto.save();
      logger.info(`Contacto creado con ID: ${savedContacto._id}`);
      return ContactoMapper.toEntity(savedContacto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al crear contacto: ${error.message}`);
      } else {
        logger.error(`Error inesperado al crear contacto: ${error}`);
      }
      throw CustomError.internal("Error al crear contacto");
    }
  }

  // Buscar un contacto por correo electrónico
  async findByEmail(email: string): Promise<ContactoEntity | null> {
    try {
      const contacto = await ContactoModel.findOne({ correo: email });
      if (!contacto) {
        logger.warn(`Contacto con correo ${email} no encontrado.`);
        return null;
      }
      logger.info(`Contacto encontrado: ${contacto.correo}`);
      return ContactoMapper.toEntity(contacto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al buscar contacto: ${error.message}`);
      } else {
        logger.error(`Error inesperado al buscar contacto: ${error}`);
      }
      throw CustomError.internal("Error al buscar contacto");
    }
  }

  // Actualizar un contacto existente
  async update(contacto: ContactoEntity): Promise<ContactoEntity> {
    try {
      const updatedContacto = await ContactoModel.findOneAndUpdate(
        { correo: contacto.correo },
        {
          nombre: contacto.nombre,
          telefono: contacto.telefono,
          activo: contacto.activo,
          fechaRegistro: contacto.fechaRegistro,
        },
        { new: true, runValidators: true }
      );

      if (!updatedContacto) {
        logger.warn(
          `Contacto con correo ${contacto.correo} no encontrado para actualizar.`
        );
        throw CustomError.notFound("Contacto no encontrado");
      }

      logger.info(`Contacto actualizado: ${updatedContacto.correo}`);
      return ContactoMapper.toEntity(updatedContacto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al actualizar contacto: ${error.message}`);
        if (error.name === "ValidationError") {
          throw CustomError.badRequest("Datos de contacto inválidos");
        }
      } else {
        logger.error(`Error inesperado al actualizar contacto: ${error}`);
      }
      throw CustomError.internal("Error al actualizar contacto");
    }
  }

  // Buscar todos los contactos
  async findAll(): Promise<ContactoEntity[]> {
    try {
      console.log("Entra en el metodo");
      const contacts = await ContactoModel.find();
      if (!contacts) throw CustomError.notFound("No contacts found");
      return contacts.map(ContactoMapper.toEntity);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al buscar todos los contactos: ${error.message}`);
        throw CustomError.internal("Error al buscar todos los contactos");
      } else {
        logger.error(`Unexpected error: ${error}`);
        throw CustomError.internal("Unexpected error occurred");
      }
    }
  }

  // Buscar contacto por ID
  async findById(id: string): Promise<ContactoEntity> {
    try {
      const contact = await ContactoModel.findById(id);
      if (!contact) throw CustomError.notFound("Contact not found");
      return ContactoMapper.toEntity(contact);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `Error al buscar contacto con ID: ${id}: ${error.message}`
        );
      } else {
        logger.error(`Error inesperado al buscar contacto con ID: ${id}`);
      }
      throw CustomError.internal("Error al buscar contacto");
    }
  }
}
