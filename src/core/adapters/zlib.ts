// src/core/adapters/ZlibAdapter.ts
import zlib from "zlib";

export class ZlibAdapter {
  /**
   * Descomprime un buffer utilizando Gzip.
   * @param data Datos comprimidos en formato Buffer.
   * @returns Promise que resuelve con los datos descomprimidos en Buffer.
   */
  static async decompress(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // Verificar que los datos no están vacíos
      if (!data || data.length === 0) {
        return reject(
          new Error("El buffer está vacío y no se puede descomprimir.")
        );
      }

      // Intentar descomprimir los datos usando zlib
      zlib.gunzip(data, (err, decompressedData) => {
        if (err) {
          // Mensaje detallado sobre el error de descompresión
          console.error("Error al intentar descomprimir los datos:", err);
          return reject(new Error("Error al descomprimir los datos."));
        }
        resolve(decompressedData);
      });
    });
  }

  /**
   * Verifica si un buffer está comprimido en Gzip.
   * @param data Datos en formato Buffer.
   * @returns Booleano indicando si los datos están comprimidos en Gzip.
   */
  static isGzip(data: Buffer): boolean {
    // Gzip tiene una cabecera específica: 1f 8b
    return data[0] === 0x1f && data[1] === 0x8b;
  }
}
