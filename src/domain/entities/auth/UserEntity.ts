// src/auth/entities/UserEntity.ts

import { UserRoles, StatusCodes } from "../../enums";
import { Validators } from "../../../shared/validators"; // Asegúrate de que esta ruta sea correcta

interface UserEntityProps {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  role: UserRoles;
  memberNumber: string;
  phone?: string;
  address?: string;
  accountNumber?: string; // Renombrado de 'acc_number' a 'accountNumber' para consistencia
  dni?: string; // Campo añadido
  comments?: string; // Campo añadido
  status?: StatusCodes;
  createdAt?: Date; // Fecha de creación opcional
  updatedAt?: Date; // Fecha de actualización opcional
}

export class UserEntity {
  // Propiedades privadas con nombres consistentes
  private _id: string;
  private _email: string;
  private _name: string;
  private _passwordHash: string;
  private _role: UserRoles;
  private _status: StatusCodes;
  private _memberNumber: string;
  private _phone: string;
  private _address: string;
  private _accountNumber: string;
  private _dni: string;
  private _comments: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor({
    id,
    email,
    name = "",
    passwordHash,
    role,
    memberNumber,
    status = StatusCodes.PENDING,
    phone = "",
    address = "",
    accountNumber = "",
    dni = "",
    comments = "",
    createdAt = new Date(),
    updatedAt = new Date(),
  }: UserEntityProps) {
    // Validaciones básicas
    if (!Validators.isValidEmail(email)) {
      throw new Error("Formato de email inválido.");
    }
    if (!Validators.isNotEmpty(memberNumber)) {
      throw new Error("Member Number es requerido.");
    }

    this._id = id;
    this._email = email;
    this._name = name;
    this._passwordHash = passwordHash;
    this._role = role;
    this._status = status;
    this._memberNumber = memberNumber;
    this._phone = phone;
    this._address = address;
    this._accountNumber = accountNumber;
    this._dni = dni;
    this._comments = comments;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get role(): UserRoles {
    return this._role;
  }

  get status(): StatusCodes {
    return this._status;
  }

  get memberNumber(): string {
    return this._memberNumber;
  }

  get phone(): string {
    return this._phone;
  }

  get address(): string {
    return this._address;
  }

  get accountNumber(): string {
    return this._accountNumber;
  }

  get dni(): string {
    return this._dni;
  }

  get comments(): string {
    return this._comments;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters
  set passwordHash(newHash: string) {
    if (!Validators.isNotEmpty(newHash)) {
      throw new Error("Password Hash no puede estar vacío.");
    }
    this._passwordHash = newHash;
    this._updatedAt = new Date();
  }

  set role(newRole: UserRoles) {
    if (!Object.values(UserRoles).includes(newRole)) {
      throw new Error("Rol inválido.");
    }
    this._role = newRole;
    this._updatedAt = new Date();
  }

  set status(newStatus: StatusCodes) {
    if (!Object.values(StatusCodes).includes(newStatus)) {
      throw new Error("Estado inválido.");
    }
    this._status = newStatus;
    this._updatedAt = new Date();
  }

  set memberNumber(newMemberNumber: string) {
    if (!Validators.isNotEmpty(newMemberNumber)) {
      throw new Error("Member Number no puede estar vacío.");
    }
    this._memberNumber = newMemberNumber;
    this._updatedAt = new Date();
  }

  set phone(newPhone: string) {
    this._phone = newPhone;
    this._updatedAt = new Date();
  }

  set address(newAddress: string) {
    this._address = newAddress;
    this._updatedAt = new Date();
  }

  set accountNumber(newAccountNumber: string) {
    this._accountNumber = newAccountNumber;
    this._updatedAt = new Date();
  }

  set dni(newDni: string) {
    this._dni = newDni;
    this._updatedAt = new Date();
  }

  set comments(newComments: string) {
    this._comments = newComments;
    this._updatedAt = new Date();
  }

  // Método estático para crear una nueva instancia con validación
  static create(props: UserEntityProps): UserEntity {
    return new UserEntity(props);
  }

  // Métodos para activar y desactivar usuarios
  activate() {
    this._status = StatusCodes.ACTIVE;
    this._updatedAt = new Date();
  }

  deactivate() {
    this._status = StatusCodes.PENDING;
    this._updatedAt = new Date();
  }

  // Método para clonar la entidad con propiedades actualizadas
  clone(updatedProps: Partial<UserEntityProps>): UserEntity {
    return UserEntity.create({
      id: updatedProps.id || this._id,
      email: updatedProps.email || this._email,
      name: updatedProps.name || this._name,
      passwordHash: updatedProps.passwordHash || this._passwordHash,
      role: updatedProps.role || this._role,
      memberNumber: updatedProps.memberNumber || this._memberNumber,
      status: updatedProps.status || this._status,
      phone: updatedProps.phone || this._phone,
      address: updatedProps.address || this._address,
      accountNumber: updatedProps.accountNumber || this._accountNumber,
      dni: updatedProps.dni || this._dni,
      comments: updatedProps.comments || this._comments,
      createdAt: updatedProps.createdAt || this._createdAt,
      updatedAt: updatedProps.updatedAt || new Date(),
    });
  }
}
