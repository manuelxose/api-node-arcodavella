import {
  ChangePasswordDTO,
  GetActiveUserByEmailDTO,
  GetActiveUserDTO,
  LoginUserDTO,
  RegisterUserDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
  UpdateProfileDTO,
} from "../../domain/dtos/auth";
import { UserEntity } from "../../domain/entities/auth";
import { ObjectId } from "mongodb";
import { AuthDataSource } from "../../domain/datasources";
import { BcryptAdapter as bcrypt } from "../../core/adapters/bcrypt";
import UserModel, { IUser } from "../../data/mongodb/models/UserModel";
import { CustomError } from "../../domain/errors";

export class MongoAuthDataSource implements AuthDataSource {
  async login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
    // Buscar el usuario por email
    const user = (await UserModel.findOne({
      email: loginUserDTO.email,
    })) as IUser;

    // Verificar si el usuario existe
    if (!user) {
      throw CustomError.badRequest("Invalid credentials: User does not exist");
    }

    console.log("las contraseñas:", loginUserDTO.password, user.password);

    // Verificar si la contraseña es válida
    const isPasswordValid = bcrypt.compare(
      loginUserDTO.password.trim(),
      user.password.trim()
    );
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      throw CustomError.badRequest("Invalid credentials: Incorrect password");
    }

    // Opcional: Verificar si la cuenta del usuario está activa (si aplicable)
    // if (user.status !== 'active') { // Suponiendo que tienes un campo `status` en el modelo
    //   throw CustomError.forbidden("Account is not active. Please contact support.");
    // }

    // Opcional: Verificar si la cuenta está bloqueada (si aplicable)
    // if (user.isLocked) { // Suponiendo que tienes un campo `isLocked` en el modelo
    //   throw CustomError.forbidden("Account is locked due to multiple failed login attempts. Please reset your password.");
    // }

    // Devolver la entidad del usuario si las credenciales son correctas
    return new UserEntity(
      user._id.toString(),
      user.email,
      user.password,
      user.role
    );
  }

  async logout(): Promise<void> {
    // Implementa la lógica de logout aquí
  }

  async register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    const existingUser = await UserModel.findOne({
      email: registerUserDTO.email,
    });

    if (existingUser) {
      throw CustomError.badRequest("User already exists");
    }

    const newUser = new UserModel({
      email: registerUserDTO.email,
      password: registerUserDTO.password,
      role: registerUserDTO.role,
    });

    await newUser.save();

    return new UserEntity(
      newUser._id.toString(),
      newUser.email,
      newUser.password,
      newUser.role
    );
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    const user = (await UserModel.findOne({
      email: resetPasswordDTO.newPassword,
    })) as IUser;
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDTO.newPassword, 10);
    user.password = hashedPassword;

    await user.save();
  }

  async updatePassword(
    changePasswordDTO: UpdatePasswordDTO
  ): Promise<UserEntity> {
    // Buscar al usuario por su ID
    const user = (await UserModel.findOne({
      _id: new ObjectId(changePasswordDTO.userId),
    })) as IUser;

    if (!user) {
      throw CustomError.badRequest("User not found");
    }

    // Actualizar la contraseña del usuario en la base de datos
    const result = await UserModel.updateOne(
      { _id: new ObjectId(changePasswordDTO.userId) }, // Filtro de búsqueda
      { $set: { password: changePasswordDTO.newPassword } } // Actualizar la contraseña con el hash ya generado
    );

    // Verificar si la actualización fue exitosa
    if (result.matchedCount === 0) {
      throw CustomError.internal("Failed to update password");
    }

    // Recuperar y devolver el usuario actualizado
    const updatedUser = (await UserModel.findOne({
      _id: new ObjectId(changePasswordDTO.userId),
    })) as IUser;

    if (!updatedUser) {
      throw CustomError.internal("Failed to retrieve updated user");
    }

    return updatedUser as any;
  }

  async updateProfile(updateProfileDTO: UpdateProfileDTO): Promise<void> {
    const updateFields: { email?: string; password?: string } = {};
    if (updateProfileDTO.email) {
      updateFields.email = updateProfileDTO.email;
    }
    if (updateProfileDTO.passwordHash) {
      updateFields.password = await bcrypt.hash(
        updateProfileDTO.passwordHash,
        10
      );
    }

    await UserModel.updateOne(
      { _id: new ObjectId(updateProfileDTO.userId) },
      { $set: updateFields }
    );
  }

  async getActiveUser(getActiveUserDTO: GetActiveUserDTO): Promise<UserEntity> {
    const user = (await UserModel.findOne({
      _id: new ObjectId(getActiveUserDTO.userId),
    })) as IUser;
    if (!user) {
      throw CustomError.badRequest("User not found");
    }

    return new UserEntity(
      user._id.toString(),
      user.email,
      user.password,
      user.role
    );
  }

  async getActiveUserByEmail(
    getActiveUserByEmailDTO: GetActiveUserByEmailDTO
  ): Promise<UserEntity> {
    const { email } = getActiveUserByEmailDTO;

    const user = (await UserModel.findOne({ email })) as IUser;
    if (!user) {
      throw CustomError.badRequest("User not found");
    }

    return new UserEntity(
      user._id.toString(),
      user.email,
      user.password,
      user.role
    );
  }
}
