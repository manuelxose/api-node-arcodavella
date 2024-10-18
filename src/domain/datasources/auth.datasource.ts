import { UserEntity } from "../entities/auth";
import {
  ChangePasswordDTO,
  GetActiveUserByEmailDTO,
  GetActiveUserDTO,
  GetUserByIdDTO,
  LoginUserDTO,
  RegisterUserDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
  UpdateProfileDTO,
} from "../dtos/auth";

export abstract class AuthDataSource {
  abstract login(loginUserDTO: LoginUserDTO): Promise<UserEntity>;
  abstract logout(): Promise<void>;
  abstract register(registerUserDTO: RegisterUserDTO): Promise<UserEntity>;

  abstract resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<void>; // Ajustar la firma del método
  abstract updateProfile(updateProfileDTO: UpdateProfileDTO): Promise<void>;
  abstract getActiveUser(
    getActiveUserDTO: GetActiveUserDTO
  ): Promise<UserEntity>;
  abstract getActiveUserByEmail(
    getActiveUserByEmailDTO: GetActiveUserByEmailDTO
  ): Promise<UserEntity>;
  abstract updatePassword(
    updatePasswordDTO: UpdatePasswordDTO
  ): Promise<UserEntity>;
  abstract getAll(): Promise<UserEntity[]>;
  abstract getById(dto: GetUserByIdDTO): Promise<UserEntity>;
}
