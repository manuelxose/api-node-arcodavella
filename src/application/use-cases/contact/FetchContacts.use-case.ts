import { ImapAdapter } from "../../../core/adapters/imap";
import logger from "../../../core/adapters/logger";
import { FetchContactsDTO } from "../../../domain/dtos/contact";
import { ContactoEntity } from "../../../domain/entities/contact/ContactEntity";
import { CustomError } from "../../../domain/errors";
import { ContactoRepository } from "../../../domain/repositories/contact.repository";

export class FetchContactsUseCase {
  constructor(
    private contactoRepository: ContactoRepository,
    private imapAdapter: ImapAdapter
  ) {}

  async execute(): Promise<void> {
    console.log("Se inicia la ejecución del caso de uso de FetchContacts");

    const searchCriteria = [["FROM", "wordpress@arcodavella.gal"]];

    const fetchOptions = {
      bodies: [""], // Obtener el mensaje completo
      markSeen: false,
      maxMessages: 50, // Limitar a los primeros 50 correos
    };

    let connection;

    try {
      console.log("Conectándose al servidor IMAP...");

      // Intentamos conectarnos al servidor IMAP
      connection = await this.imapAdapter.connect();
      console.log("Conectado al servidor IMAP.");

      await connection.openBox("INBOX");
      console.log("Abierta la bandeja de entrada.");

      let results;
      try {
        results = await this.imapAdapter.searchWithTimeout(
          connection,
          searchCriteria,
          fetchOptions,
          20000 // Aumentar el timeout a 20 segundos si es necesario
        );
      } catch (searchError: any) {
        console.error(
          `Error durante la búsqueda de correos: ${searchError.message}`
        );
        return;
      }

      if (!results || results.length === 0) {
        logger.info("No se encontraron correos con el criterio especificado.");
        return;
      }

      // Procesar los correos obtenidos
      for (const [index, item] of results.entries()) {
        console.log(`Procesando correo #${index + 1} de ${results.length}`);

        try {
          const all = item.parts.find((part: any) => part.which === "");

          if (!all || !all.body) {
            console.warn("El correo no contiene el cuerpo completo.");
            continue;
          }

          const rawMessage = all.body;

          // Parsear el correo completo
          const parsed = await this.imapAdapter.parseMail(rawMessage);

          const date = parsed.date ? new Date(parsed.date) : new Date();
          const body = parsed.text || "";

          // Extraer datos del cuerpo del correo
          const extractedData = this.extractData(body);

          if (extractedData) {
            // Crear el DTO y validar los datos
            const [error, fetchContactsDTO] =
              FetchContactsDTO.create(extractedData);
            if (error || !fetchContactsDTO) {
              logger.warn(
                `Datos inválidos extraídos del correo: ${error?.message}`
              );
              continue; // Saltar este contacto y continuar con el siguiente
            }

            // Verificar si el contacto ya existe por correo electrónico
            const existingContact =
              await this.contactoRepository.getContactoByEmail(
                fetchContactsDTO.correo
              );
            if (existingContact) {
              logger.info(
                `El contacto con correo ${fetchContactsDTO.correo} ya existe.`
              );
              continue;
            }

            // Crear la entidad ContactoEntity usando el DTO
            const contacto = ContactoEntity.create({
              id: "", // Se asignará al guardar en la base de datos
              nombre: fetchContactsDTO.nombre,
              correo: fetchContactsDTO.correo,
              telefono: fetchContactsDTO.telefono,
              fechaRegistro: date,
              activo: true,
            });

            // Almacenar el contacto en el repositorio
            await this.contactoRepository.addContacto(contacto);
            logger.info(`Contacto almacenado: ${JSON.stringify(contacto)}`);
          } else {
            logger.warn("Datos insuficientes para almacenar el contacto.");
          }
        } catch (error: any) {
          logger.error(`Error procesando el correo: ${error.message}`);
        }
      }
    } catch (error: any) {
      logger.error(`Error al procesar los correos: ${error.message}`);
      throw CustomError.internal("Error al procesar los correos");
    } finally {
      // Asegurarse de cerrar la conexión en cualquier caso
      if (connection) {
        console.log("Finalizando conexión con el servidor IMAP.");
        connection.end();
      }
    }
  }

  private extractData(
    body: string
  ): { nombre: string; correo: string; telefono: string } | null {
    console.log("Cuerpo del correo:\n", body);

    const nombreMatch = body.match(/Solicita:\s*(.+)/i);
    const correoMatch = body.match(/Correo:\s*([\w.-]+@[\w.-]+\.\w+)/i);
    const telefonoMatch = body.match(/T[eé]lefono de Contacto[:\s]*([\d\s]+)/i);

    console.log("Resultados de las expresiones regulares:");
    console.log("nombreMatch:", nombreMatch);
    console.log("correoMatch:", correoMatch);
    console.log("telefonoMatch:", telefonoMatch);

    if (nombreMatch && correoMatch && telefonoMatch) {
      return {
        nombre: nombreMatch[1].trim(),
        correo: correoMatch[1].trim(),
        telefono: telefonoMatch[1].trim(),
      };
    }

    return null;
  }
}
