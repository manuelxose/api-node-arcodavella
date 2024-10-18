import { Validators } from "../../../shared";

export class GetLogsByEmailDTO {
  public readonly email: string;

  private constructor(data: { email: string }) {
    this.email = data.email;
  }

  /**
   * Crea una instancia de GetLogsByEmailDTO con validación de campos.
   * @param data Datos del inicio de sesión.
   * @returns Instancia de GetLogsByEmailDTO.
   * @throws CustomError si la validación falla.
   */
  static create(data: Partial<GetLogsByEmailDTO>): GetLogsByEmailDTO {
    const errors: { [key: string]: string } = {};

    // Validar que el email esté presente y no esté vacío
    if (!Validators.isNotEmpty(data.email)) {
      errors.email = "Email is required.";
    } else if (!Validators.isValidEmail(data.email!)) {
      errors.email = "Invalid email format.";
    }

    // Si hay errores, lanzar un CustomError con los detalles
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    // Crear y retornar la instancia de DTO
    return new GetLogsByEmailDTO({
      email: data.email!,
    });
  }
}
