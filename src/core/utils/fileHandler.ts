import fs from "fs";
import path from "path";
import { MulterAdapter } from "../adapters/multer";

export class FileHandler {
  private uploadDir: string;
  private multerAdapter: MulterAdapter;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
    this.multerAdapter = new MulterAdapter(uploadDir);
  }

  /**
   * Configura y devuelve el middleware de multer para manejar la carga de un solo archivo.
   */
  singleFileUpload(fieldName: string) {
    return this.multerAdapter.singleFileUpload(fieldName);
  }

  /**
   * Configura y devuelve el middleware de multer para manejar la carga de múltiples archivos.
   */
  multipleFileUpload(fieldName: string, maxCount: number) {
    return this.multerAdapter.multipleFileUpload(fieldName, maxCount);
  }

  /**
   * Elimina un archivo en el servidor.
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);

    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(`Error al eliminar el archivo: ${err.message}`);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Verifica si un archivo existe.
   */
  fileExists(filename: string): boolean {
    const filePath = path.join(this.uploadDir, filename);
    return fs.existsSync(filePath);
  }

  /**
   * Lee un archivo y lo devuelve como un buffer.
   */
  async readFile(filename: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, filename);

    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(`Error al leer el archivo: ${err.message}`);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Lista todos los archivos en un directorio con un filtro opcional.
   * @param dirPath - El directorio a listar.
   * @param filter - Filtro de extensión (ej: '.ts' o '.js').
   * @returns Un array de nombres de archivo.
   */
  listFiles(dirPath: string, filter?: string): string[] {
    const fullPath = path.resolve(dirPath);
    const files = fs.readdirSync(fullPath);

    return filter ? files.filter((file) => file.endsWith(filter)) : files;
  }
}
