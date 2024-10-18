import { compareSync, hashSync } from "bcryptjs";

export class BcryptAdapter {
  private static readonly SALT_ROUNDS = 12; // Definimos un número de rondas de sal adecuado para seguridad

  /**
   * Genera un hash de la contraseña utilizando bcryptjs.
   * Inmediatamente después de generar el hash, verifica que la contraseña en texto plano
   * coincida con el hash generado.
   * @param value - La contraseña en texto plano.
   * @param saltRounds - Número de rondas de sal (opcional, por defecto 12).
   * @returns El hash generado si la verificación es exitosa, lanza un error en caso contrario.
   */
  static hash(
    value: string,
    saltRounds: number = BcryptAdapter.SALT_ROUNDS
  ): string {
    try {
      const hashedPassword = hashSync(value, saltRounds);

      // Verificar inmediatamente si el hash coincide con la contraseña en texto plano
      const isMatch = BcryptAdapter.compare(value, hashedPassword);
      if (!isMatch) {
        throw new Error(
          "Hash verification failed. Generated hash does not match the plain text password."
        );
      }

      return hashedPassword;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to hash the password: ${error.message}`);
      }
      throw new Error(`Failed to hash the password: ${error}`);
    }
  }

  /**
   * Compara una contraseña en texto plano con un hash almacenado.
   * Implementa una comparación constante para evitar ataques de tiempo.
   * @param value - La contraseña en texto plano.
   * @param hash - El hash con el que se compara la contraseña.
   * @returns `true` si la contraseña coincide con el hash, `false` en caso contrario.
   */
  static compare(value: string, hash: string): boolean {
    try {
      return compareSync(value, hash);
    } catch (error) {
      // Si la comparación falla, lanza un error

      if (error instanceof Error) {
        throw new Error(
          `Failed to compare password and hash: ${error.message}`
        );
      } else {
        throw new Error(`Failed to compare password and hash: ${error}`);
      }
    }
  }
}
