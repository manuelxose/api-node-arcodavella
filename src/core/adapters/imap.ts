// src/infrastructure/adapters/imapAdapter.ts

import imaps, { ImapSimpleOptions, ImapSimple, Message } from "imap-simple";
import { simpleParser, ParsedMail } from "mailparser";
import { env } from "../config/env";
import logger from "./logger";

// Definir y Exportar el Tipo para SearchCriteria
export type SearchCriteria = [string, string][];

// Definir y Exportar la Interfaz para FetchOptions
export interface FetchOptions {
  bodies: string[]; // Partes del cuerpo que quieres obtener (por ejemplo, HEADER, TEXT)
  markSeen?: boolean; // Si los mensajes deben marcarse como leídos
  maxMessages?: number; // Límite de número de mensajes a recuperar
}

export class ImapAdapter {
  private config: ImapSimpleOptions;

  constructor() {
    // Asegurarse de que el puerto sea un número válido, usar 993 por defecto si no está definido
    const port = env.emailInfoPort;

    this.config = {
      imap: {
        user: env.emailInfoUser,
        password: env.emailInfoPass,
        host: env.emailInfoHost,
        port: port,
        tls: true,
        authTimeout: 10000, // Aumentar el timeout de autenticación si es necesario
      },
    };
  }

  /**
   * Conecta al servidor IMAP y retorna la conexión.
   */
  async connect(): Promise<ImapSimple> {
    try {
      const connection = await imaps.connect(this.config);
      logger.info("Conectado al servidor IMAP");
      return connection;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al conectar al servidor IMAP: ${error.message}`);
      } else {
        logger.error(`Error al conectar al servidor IMAP: ${error}`);
      }
      throw error;
    }
  }

  /**
   * Parsea el contenido del correo utilizando mailparser.
   * @param source - El contenido del correo en formato string o buffer.
   * @returns Una promesa que resuelve un objeto ParsedMail.
   */
  async parseMail(source: string | Buffer): Promise<ParsedMail> {
    try {
      const parsed = await simpleParser(source);
      return parsed;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error al parsear el correo: ${error.message}`);
      } else {
        logger.error(`Error al parsear el correo: ${error}`);
      }
      throw error;
    }
  }

  /**
   * Realiza una búsqueda en el servidor IMAP con un tiempo de espera específico.
   * @param connection - La conexión IMAP.
   * @param searchCriteria - Los criterios de búsqueda.
   * @param fetchOptions - Las opciones de fetch.
   * @param timeout - Tiempo de espera en milisegundos.
   * @returns Una promesa que resuelve los resultados de la búsqueda.
   */
  async searchWithTimeout(
    connection: ImapSimple,
    searchCriteria: SearchCriteria,
    fetchOptions: FetchOptions,
    timeout: number
  ): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("La búsqueda de correos excedió el tiempo de espera"));
      }, timeout);

      connection
        .search(searchCriteria, fetchOptions)
        .then((results) => {
          clearTimeout(timer);
          resolve(results);
        })
        .catch((error: unknown) => {
          clearTimeout(timer);
          if (error instanceof Error) {
            reject(error);
          } else {
            reject(new Error("Error desconocido durante la búsqueda"));
          }
        });
    });
  }
}
