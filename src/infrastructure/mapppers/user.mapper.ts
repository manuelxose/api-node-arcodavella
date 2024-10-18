import { UserEntity } from "../../domain/entities/auth/UserEntity";
import { UserRoles, StatusCodes } from "../../domain/enums";

interface UserDTO {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRoles;
  status: StatusCodes;
  name: string;
  phone: string;
  address: string;
  accountNumber: string;
  dni: string;
  memberNumber: string | null; // Allow null here
  createdAt: Date;
  updatedAt: Date;
}

export class UserMapper {
  // Converts a DTO object (partial) into a UserEntity
  static toEntity(data: Partial<UserDTO>): UserEntity {
    return UserEntity.create({
      id: data.id || "",
      email: data.email || "",
      passwordHash: data.passwordHash || "",
      role: data.role || UserRoles.USER, // Default role
      memberNumber: data.memberNumber || StatusCodes.PENDING, // Default to StatusCodes.PENDING for memberNumber
      name: data.name || StatusCodes.PENDING, // Default name value to StatusCodes.PENDING
      phone: data.phone || StatusCodes.PENDING, // Default phone value
      address: data.address || StatusCodes.PENDING, // Default address value
      accountNumber: data.accountNumber || StatusCodes.PENDING, // Default account number value
      dni: data.dni || StatusCodes.PENDING, // Default dni value
      status: data.status || StatusCodes.PENDING, // Default status
      createdAt: data.createdAt || new Date(), // Set default createdAt
      updatedAt: data.updatedAt || new Date(), // Set default updatedAt
    });
  }

  // Converts a UserEntity into a DTO object
  static toDTO(entity: UserEntity): UserDTO {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      role: entity.role,
      status: entity.status,
      name: entity.name,
      phone: entity.phone,
      address: entity.address,
      accountNumber: entity.accountNumber,
      dni: entity.dni,
      memberNumber: entity.memberNumber, // `memberNumber` is handled separately now
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // Converts an array of UserEntity into an array of DTO objects
  static toDTOs(entities: UserEntity[]): UserDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  // Updates an existing entity by cloning it with the provided partial data
  static updateEntity(entity: UserEntity, data: Partial<UserDTO>): UserEntity {
    return entity.clone({
      email: data.email || entity.email,
      passwordHash: data.passwordHash || entity.passwordHash,
      role: data.role || entity.role,
      memberNumber: data.memberNumber || entity.memberNumber, // `memberNumber` remains independent
      name: data.name || entity.name,
      phone: data.phone || entity.phone,
      address: data.address || entity.address,
      accountNumber: data.accountNumber || entity.accountNumber,
      dni: data.dni || entity.dni,
      status: data.status || entity.status,
      updatedAt: new Date(), // Always update the modification date
    });
  }
}
