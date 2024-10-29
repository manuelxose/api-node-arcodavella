import {
  GetActiveUserByEmailDTO,
  GetActiveUserDTO,
  GetUserByIdDTO,
  LoginUserDTO,
  RegisterUserDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
  UpdateProfileDTO,
} from "../../domain/dtos/auth";

import { UserEntity } from "../../domain/entities/auth/UserEntity";
import { ObjectId } from "mongodb";
import { AuthDataSource } from "../../domain/datasources";
import { BcryptAdapter as bcrypt } from "../../core/adapters/bcrypt";
import UserModel, {
  IUser,
  StatusCodes,
} from "../../data/mongodb/models/UserModel";
import { CustomError } from "../../domain/errors";
import { UserMapper } from "../mapppers";
import { UserRoles } from "../../domain/enums";
import logger from "../../core/adapters/logger";

export class MongoAuthDataSource implements AuthDataSource {
  // Login a user using their credentials
  async login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
    const user = await this.findUserByEmail(loginUserDTO.email);
    const isPasswordValid = bcrypt.compare(
      loginUserDTO.password.trim(),
      user.password.trim()
    );

    if (!isPasswordValid) {
      throw CustomError.badRequest("Invalid credentials: Incorrect password");
    }

    console.log("Devuelve mapeado o klk", user);

    const userMapped = UserMapper.toEntity(user); // Usa el UserMapper para convertir a entidad
    return userMapped;
  }

  // Register a new user in the system
  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    const existingUser = await UserModel.findOne({
      email: registerUserDTO.email,
    });

    if (existingUser) {
      throw CustomError.badRequest("User already exists");
    }

    console.log("usuario a regostrar: ", registerUserDTO);

    const hashedPassword = bcrypt.hash(registerUserDTO.password, 10);
    const newUser = new UserModel({
      email: registerUserDTO.email,
      password: hashedPassword,
      role: registerUserDTO.role,
      status: StatusCodes.PENDING, // Estado por defecto
      memberNumber: "UNASIGNED",
    });

    await newUser.save();

    return UserMapper.toEntity(newUser); // Usa el UserMapper para convertir a entidad
  }

  // Reset the password of a user
  async resetPassword(_resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    // Implementar lógica de restablecimiento de contraseña aquí si es necesario
    logger.info("Funcion no implementada", _resetPasswordDTO);
  }

  async updatePassword(
    changePasswordDTO: UpdatePasswordDTO
  ): Promise<UserEntity> {
    const user = await this.findUserById(changePasswordDTO.userId);

    if (!user) {
      throw CustomError.badRequest("User not found");
    }

    // Ensure the new password is not the same as the current password
    const isPasswordSame = await bcrypt.compare(
      changePasswordDTO.newPassword,
      user.password
    );

    if (isPasswordSame) {
      throw CustomError.badRequest(
        "New password cannot be the same as the old one"
      );
    }

    // Update the password in the database
    const result = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: changePasswordDTO.newPassword } },
      { new: true }
    );

    if (!result) {
      throw CustomError.notFound("User not UPDATED");
    }

    return UserMapper.toEntity(result);
  }

  // Update user profile information

  // Método para actualizar el perfil del usuario
  // Método para actualizar el perfil del usuario
  async updateProfile(updateProfileDTO: UpdateProfileDTO): Promise<void> {
    try {
      console.log(
        `Actualizando perfil para el usuario con ID: ${updateProfileDTO.id}`
      );

      // Fetch the user by ID
      const user = await this.findUserById(updateProfileDTO.id);
      console.log("Usuario encontrado:", user);
      console.log("dto", updateProfileDTO);

      if (!user) {
        throw CustomError.badRequest("User not found");
      }

      // Initialize updatable fields, incluyendo los nuevos campos como name, dni, etc.
      const updateFields: Partial<{
        email: string;
        password: string;
        role: UserRoles;
        status: StatusCodes;
        memberNumber: string;
        phone: string;
        address: string;
        accountNumber: string;
        name: string;
        dni: string;
      }> = {};

      // Helper function para verificar si un campo ha cambiado y necesita actualización
      const addIfChanged = <K extends keyof typeof updateFields, V>(
        field: K,
        newValue: V,
        oldValue: V
      ) => {
        if (newValue !== undefined && newValue !== oldValue) {
          updateFields[field] = newValue as (typeof updateFields)[K];
        }
      };

      // Validar y actualizar el email si ha cambiado
      if (updateProfileDTO.email && updateProfileDTO.email !== user.email) {
        const existingUser = await UserModel.findOne({
          email: updateProfileDTO.email,
        });
        if (
          existingUser &&
          existingUser._id.toString() !== updateProfileDTO.id
        ) {
          throw CustomError.badRequest("Email already in use by another user");
        }
        updateFields.email = updateProfileDTO.email;
      }

      // Manejar la actualización de la contraseña con hash bcrypt si se proporciona y es diferente de la anterior
      if (updateProfileDTO.passwordHash) {
        const isPasswordSame = await bcrypt.compare(
          updateProfileDTO.passwordHash,
          user.password
        );
        if (!isPasswordSame) {
          const hashedPassword = await bcrypt.hash(
            updateProfileDTO.passwordHash,
            10
          );
          updateFields.password = hashedPassword;
        } else {
          throw CustomError.badRequest(
            "New password cannot be the same as the old one"
          );
        }
      }

      // Usar la función helper para agregar campos cambiados
      addIfChanged("role", updateProfileDTO.role, user.role);
      addIfChanged("status", updateProfileDTO.status, user.status);
      addIfChanged(
        "memberNumber",
        updateProfileDTO.memberNumber,
        user.memberNumber
      );
      addIfChanged("phone", updateProfileDTO.phone, user.phone);
      addIfChanged("address", updateProfileDTO.address, user.address);
      addIfChanged(
        "accountNumber",
        updateProfileDTO.accountNumber,
        user.accountNumber
      );
      addIfChanged("name", updateProfileDTO.name, user.name);
      addIfChanged("dni", updateProfileDTO.dni, user.dni);

      // Lanzar un error si no hay actualizaciones válidas
      if (Object.keys(updateFields).length === 0) {
        throw CustomError.badRequest("No valid updates provided");
      }

      console.log("Campos a actualizar:", updateFields);

      // Actualizar los campos válidos en MongoDB
      const result = await UserModel.updateOne(
        { _id: new ObjectId(updateProfileDTO.id) },
        { $set: updateFields }
      );

      if (result.modifiedCount === 0) {
        throw CustomError.internal("Failed to update the user profile.");
      }

      console.log(
        `User profile updated successfully for ID: ${updateProfileDTO.id}`
      );
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error; // Re-lanzar el error después de registrarlo
    }
  }
  // Retrieve an active user by their ID
  async getActiveUser(getActiveUserDTO: GetActiveUserDTO): Promise<UserEntity> {
    const user = await this.findUserById(getActiveUserDTO.userId);
    return UserMapper.toEntity(user); // Usa el UserMapper para convertir a entidad
  }

  // Retrieve an active user by their email
  async getActiveUserByEmail(
    getActiveUserByEmailDTO: GetActiveUserByEmailDTO
  ): Promise<UserEntity> {
    const user = await this.findUserByEmail(getActiveUserByEmailDTO.email);
    console.log(user);
    if (!user) {
      throw CustomError.badRequest("User not found");
    }
    return UserMapper.toEntity(user); // Usa el UserMapper para convertir a entidad
  }

  // Helper method to find a user by ID
  private async findUserById(userId: string): Promise<IUser> {
    const user = (await UserModel.findById(new ObjectId(userId))) as IUser;
    if (!user) {
      throw CustomError.badRequest("User not found");
    }
    return user;
  }

  // Helper method to find a user by email
  private async findUserByEmail(email: string): Promise<IUser> {
    const user = (await UserModel.findOne({ email })) as IUser;
    if (!user) {
      throw CustomError.badRequest("User not found");
    }
    return user;
  }

  async logout(): Promise<void> {
    // Implementa la lógica de logout aquí si es necesario
  }

  // Method to retrieve all users
  async getAll(): Promise<UserEntity[]> {
    console.log("getAll");

    // Retrieve all users from MongoDB
    const users = await UserModel.find(); // No filtering, retrieving all users
    if (!users) {
      throw CustomError.notFound("No users found");
    }

    console.log("users: ", users);

    // Convert each user from MongoDB model to UserEntity
    return users.map((user) => UserMapper.toEntity(user));
  }

  // Method to retrieve a user by id
  async getById(dto: GetUserByIdDTO): Promise<UserEntity> {
    // Retrieve user from MongoDB
    const user = await UserModel.findById(dto.userId);
    if (!user) {
      throw CustomError.badRequest("User not found");
    }

    // Convert user from MongoDB model to UserEntity
    return UserMapper.toEntity(user);
  }
}
