// src/infrastructure/adapters/imapAdapter.ts

import imaps, { ImapSimpleOptions, ImapSimple, Message } from "imap-simple";
import { simpleParser, ParsedMail } from "mailparser";
import { env } from "../config/env";
import logger from "./logger";

export class ImapAdapter {
  private config: ImapSimpleOptions;

  constructor() {
    this.config = {
      imap: {
        user: env.emailInfoUser,
        password: env.emailInfoPass,
        host: env.emailInfoHost,
        port: parseInt(env.emailInfoPort as string, 10),
        tls: true,
        authTimeout: 10000, // Aumentar el timeout de autenticación
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
    } catch (error: any) {
      logger.error(`Error al conectar al servidor IMAP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Parsea el contenido del correo utilizando mailparser.
   * @param source - El contenido del correo en formato string.
   * @returns Una promesa que resuelve un objeto ParsedMail.
   */
  async parseMail(source: string | Buffer): Promise<ParsedMail> {
    try {
      const parsed = await simpleParser(source);
      return parsed;
    } catch (error) {
      logger.error(`Error al parsear el correo: ${error}`);
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
    searchCriteria: any,
    fetchOptions: any,
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
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
}
