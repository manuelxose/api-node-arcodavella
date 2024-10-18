/* eslint-disable @typescript-eslint/no-unused-vars */
// src/interface/controllers/contact.controller.ts

import { Request, Response, NextFunction } from "express";
import {
  FetchContactsUseCase,
  GetAllContactUseCase,
  GetContactUseCase,
  UnsuscribeContactsUseCase,
} from "../../application/use-cases/contact";
import {
  UnsubscribeContactoDTO,
  GetContactByIdDTO,
  SubscribeContactDTO,
} from "../../domain/dtos/contact";

/**
 * ContactController
 *
 * Este controlador maneja las solicitudes HTTP relacionadas con los contactos.
 * Utiliza casos de uso para encapsular la lógica de negocio.
 */
export class ContactController {
  // Casos de uso que este controlador utilizará
  private fetchContactsUseCase: FetchContactsUseCase;
  private unsubscribeContactsUseCase: UnsuscribeContactsUseCase;
  private getContactUseCase: GetContactUseCase;
  private getAllContactsUseCase: GetAllContactUseCase;

  /**
   * Constructor del ContactController.
   *
   * @param fetchContactsUseCase - Caso de uso para obtener contactos desde una fuente externa.
   * @param unsubscribeContactsUseCase - Caso de uso para desuscribir un contacto.
   * @param getContactUseCase - Caso de uso para obtener un contacto específico.
   * @param getAllContactsUseCase - Caso de uso para obtener todos los contactos.
   */
  constructor(
    fetchContactsUseCase: FetchContactsUseCase,
    unsubscribeContactsUseCase: UnsuscribeContactsUseCase,
    getContactUseCase: GetContactUseCase,
    getAllContactsUseCase: GetAllContactUseCase
  ) {
    this.fetchContactsUseCase = fetchContactsUseCase;
    this.unsubscribeContactsUseCase = unsubscribeContactsUseCase;
    this.getContactUseCase = getContactUseCase;
    this.getAllContactsUseCase = getAllContactsUseCase;
  }

  /**
   * Envía una respuesta de error personalizada.
   *
   * @param res - Objeto de respuesta de Express.
   * @param error - Objeto de error.
   * @param statusCode - Código de estado HTTP (por defecto 400).
   * @returns Objeto de respuesta con el error.
   */
  private sendError(
    res: Response,
    error: Error,
    statusCode: number = 400
  ): Response {
    return res.status(statusCode).send({ error: error.message });
  }

  /**
   * Obtiene todos los contactos.
   *
   * Ruta: GET /contacts/all
   *
   * @param req - Objeto de solicitud de Express.
   * @param res - Objeto de respuesta de Express.
   * @param next - Función de middleware de Express para el manejo de errores.
   * @returns Respuesta con todos los contactos o un error.
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log("Entra en la ruta");
      // Ejecuta el caso de uso para obtener todos los contactos
      const contacts = await this.getAllContactsUseCase.execute();
      res.status(200).json({ contacts });
    } catch (error) {
      console.error("Error al obtener todos los contactos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  /**
   * Suscribe a un nuevo contacto.
   *
   * Ruta: POST /contacts/subscribe
   *
   * @param req - Objeto de solicitud de Express.
   * @param res - Objeto de respuesta de Express.
   * @param next - Función de middleware de Express para el manejo de errores.
   * @returns Respuesta confirmando la suscripción o un error.
   */
  public subscribe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    // Crea el DTO para suscribir un contacto desde el cuerpo de la solicitud
    const [error, subscribeDTO] = SubscribeContactDTO.create(req.body);
    if (error) {
      return this.sendError(res, error, 400);
    }

    try {
      // Ejecuta el caso de uso para suscribir el contacto
      const result = await this.fetchContactsUseCase.execute();
      res.status(201).json(result);
    } catch (err) {
      console.error("Error al suscribir contacto:", err);
      next(err);
    }
  };

  /**
   * Desuscribe a un contacto existente.
   *
   * Ruta: POST /contacts/unsubscribe
   *
   * @param req - Objeto de solicitud de Express.
   * @param res - Objeto de respuesta de Express.
   * @param next - Función de middleware de Express para el manejo de errores.
   * @returns Respuesta confirmando la desuscripción o un error.
   */
  public unsubscribe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    // Crea el DTO para desuscribir un contacto desde el cuerpo de la solicitud
    const [error, unsubscribeDTO] = UnsubscribeContactoDTO.create(req.body);
    if (error) {
      return this.sendError(res, error, 400);
    }

    try {
      // Ejecuta el caso de uso para desuscribir el contacto
      const result = await this.unsubscribeContactsUseCase.execute(
        unsubscribeDTO!
      );
      res.status(200).json(result);
    } catch (err) {
      console.error("Error al desuscribir contacto:", err);
      next(err);
    }
  };

  /**
   * Obtiene un contacto específico por su ID.
   *
   * Ruta: GET /contacts/:id
   *
   * @param req - Objeto de solicitud de Express.
   * @param res - Objeto de respuesta de Express.
   * @param next - Función de middleware de Express para el manejo de errores.
   * @returns Respuesta con el contacto solicitado o un error.
   */
  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = req.params;

    // Crea el DTO para obtener un contacto por ID desde los parámetros de la solicitud
    const [error, getContactDTO] = GetContactByIdDTO.create({ id: id });
    if (error) {
      return this.sendError(res, error, 400);
    }

    try {
      // Ejecuta el caso de uso para obtener el contacto por ID
      const contact = await this.getContactUseCase.execute(getContactDTO!);
      res.status(200).json(contact);
    } catch (err) {
      console.error("Error al obtener contacto por ID:", err);
      next(err);
    }
  };

  /**
   * Obtiene contactos desde una fuente externa y los almacena.
   *
   * Ruta: POST /contacts/fetch
   *
   * @param req - Objeto de solicitud de Express.
   * @param res - Objeto de respuesta de Express.
   * @param next - Función de middleware de Express para el manejo de errores.
   * @returns Respuesta confirmando la operación o un error.
   */
  public fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      // Ejecuta el caso de uso para obtener y almacenar contactos
      await this.fetchContactsUseCase.execute();
      res
        .status(200)
        .json({ message: "Contactos obtenidos y almacenados exitosamente" });
    } catch (err) {
      console.error("Error al obtener contactos:", err);
      next(err);
    }
  };
}
