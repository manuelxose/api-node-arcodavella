import { UserRoles } from "../../enums/UserRoles"; // Importar el enum

export class UserEntity {
  private _passwordHash: string;

  constructor(
    public readonly id: string,
    public readonly email: string,
    passwordHash: string,
    public role: UserRoles // Usar el enum aquí
  ) {
    this._passwordHash = passwordHash;
  }

  // Método getter para acceder al hash de la contraseña
  get passwordHash(): string {
    return this._passwordHash;
  }

  // Método setter para actualizar el hash de la contraseña
  set passwordHash(newHash: string) {
    // Aquí puedes agregar validaciones o lógica adicional si es necesario
    this._passwordHash = newHash;
  }

  // Método estático para crear una nueva instancia de UserEntity
  static create(
    id: string,
    email: string,
    passwordHash: string,
    role: UserRoles
  ): UserEntity {
    return new UserEntity(id, email, passwordHash, role);
  }
}
