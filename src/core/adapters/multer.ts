import multer, { StorageEngine } from "multer";

export class MulterAdapter {
  private storage: StorageEngine;

  constructor(uploadDir: string) {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
      },
    });
  }

  /**
   * Configura y devuelve el middleware de multer para manejar la carga de un solo archivo.
   * @param fieldName - Nombre del campo del formulario que contiene el archivo.
   * @returns Middleware de multer configurado.
   */
  singleFileUpload(fieldName: string) {
    return multer({ storage: this.storage }).single(fieldName);
  }

  /**
   * Configura y devuelve el middleware de multer para manejar la carga de múltiples archivos.
   * @param fieldName - Nombre del campo del formulario que contiene los archivos.
   * @param maxCount - Número máximo de archivos permitidos.
   * @returns Middleware de multer configurado.
   */
  multipleFileUpload(fieldName: string, maxCount: number) {
    return multer({ storage: this.storage }).array(fieldName, maxCount);
  }

  /**
   * Configura y devuelve el middleware de multer para manejar múltiples campos de carga de archivos.
   * @param fields - Un array de objetos que especifican los campos y límites.
   * @returns Middleware de multer configurado.
   */
  mixedFileUpload(fields: { name: string; maxCount: number }[]) {
    return multer({ storage: this.storage }).fields(fields);
  }
}
