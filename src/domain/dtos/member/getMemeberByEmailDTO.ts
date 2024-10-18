import { Validators } from "../../../shared/validators";

export class GetMemberByEmailDTO {
  public email: string;

  // Constructor privado para asegurar que solo se cree una instancia a través de la función create
  private constructor(email: string) {
    this.email = email;
  }

  // Método para crear la instancia de GetMemberByEmailDTO con validación
  static create(email: string): [Error | null, GetMemberByEmailDTO | null] {
    const errors: { [key: string]: string } = {};

    // Validar si el email está presente y es un string válido
    if (!Validators.isNotEmpty(email)) {
      errors.email = "Email is required";
    } else if (!Validators.isValidEmail(email)) {
      errors.email = "Invalid email format";
    }

    // Si hay errores, devolver un Error con los detalles
    if (Object.keys(errors).length > 0) {
      return [new Error(JSON.stringify(errors)), null];
    }

    // Si todo está bien, devolver la instancia de GetMemberByEmailDTO
    return [null, new GetMemberByEmailDTO(email)];
  }
}
