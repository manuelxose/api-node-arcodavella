import { Validators } from "../../../shared/validators";
import { NotificationTypes, StatusCodes, UserRoles } from "../../enums";

export class UpdateProfileDTO {
  public readonly id: string;
  public readonly email?: string;
  public readonly passwordHash?: string;
  public readonly role?: UserRoles;
  public readonly status: StatusCodes;
  public readonly memberNumber?: string;
  public readonly phone?: string;
  public readonly address?: string;
  public readonly accountNumber?: string;
  public readonly updateType: NotificationTypes | null;
  public readonly name?: string;
  public readonly dni?: string;
  public readonly updatedAt?: string;

  private constructor(data: {
    id: string;
    email?: string;
    passwordHash?: string;
    role?: UserRoles;
    status: StatusCodes;
    memberNumber?: string;
    phone?: string;
    address?: string;
    accountNumber?: string;
    updateType: NotificationTypes | null;
    name?: string;
    dni?: string;
    updatedAt?: string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.role = data.role;
    this.status = data.status;
    this.memberNumber = data.memberNumber;
    this.phone = data.phone;
    this.address = data.address;
    this.accountNumber = data.accountNumber;
    this.updateType = data.updateType;
    this.name = data.name;
    this.dni = data.dni;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Crea una instancia de UpdateProfileDTO con validación.
   * @param data Datos para actualizar el perfil.
   * @returns Instancia de UpdateProfileDTO.
   * @throws Error si la validación falla.
   */
  static create(data: Partial<UpdateProfileDTO>): UpdateProfileDTO {
    console.log("datos en el dto: ", data);
    const errors: { [key: string]: string } = {};

    // Validar el ID del usuario
    if (!Validators.isNotEmpty(data.id)) {
      errors.id = "User ID is required.";
    }

    // Validar el estado
    if (!data.status || !Object.values(StatusCodes).includes(data.status)) {
      errors.status = "A valid status is required.";
    }

    // Validar el nombre si se proporciona
    if (data.name !== undefined && !Validators.isNotEmpty(data.name)) {
      errors.name = "Name must be a valid non-empty string.";
    }

    // Validar el DNI si se proporciona
    if (data.dni !== undefined && !Validators.isNotEmpty(data.dni)) {
      errors.dni = "DNI must be a valid non-empty string.";
    }

    // Determinar el tipo de actualización basado en el estado y el ID
    const updateType =
      data.status === StatusCodes.ACTIVE && Validators.isNotEmpty(data.id)
        ? NotificationTypes.ACEPT_USER
        : null;

    // Verificar si hay campos no permitidos proporcionados
    const allowedFields: Array<keyof UpdateProfileDTO> = [
      "id",
      "email",
      "passwordHash",
      "role",
      "status",
      "memberNumber",
      "phone",
      "address",
      "accountNumber",
      "name",
      "dni",
      "updateType",
      "updatedAt",
    ];

    Object.keys(data).forEach((key) => {
      if (!allowedFields.includes(key as keyof UpdateProfileDTO)) {
        errors[key] = `Field "${key}" is not allowed.`;
      }
    });

    // Si hay errores, lanzar una excepción con los detalles
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    // Crear y retornar la instancia de DTO
    return new UpdateProfileDTO({
      id: data.id!,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      status: data.status!,
      memberNumber: data.memberNumber,
      phone: data.phone,
      address: data.address,
      accountNumber: data.accountNumber,
      updateType,
      name: data.name,
      dni: data.dni,
      updatedAt: data.updatedAt,
    });
  }
}
