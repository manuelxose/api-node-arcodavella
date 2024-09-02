import {
  GetActiveUserDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
} from "../dtos/auth";
import {
  LoginUserDTO,
  RegisterUserDTO,
  ChangePasswordDTO,
  UpdateProfileDTO,
  GetActiveUserByEmailDTO,
} from "../dtos/auth";
import { UserEntity } from "../entities/auth";

export abstract class AuthRepository {
  abstract login(loginUserDTO: LoginUserDTO): Promise<UserEntity>;
  abstract logout(): Promise<void>;
  abstract register(registerUserDTO: RegisterUserDTO): Promise<UserEntity>;
  abstract resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<void>;
  abstract updateProfile(updateProfileDTO: UpdateProfileDTO): Promise<void>;
  abstract getActiveUser(
    getActiveUserDTO: GetActiveUserDTO
  ): Promise<UserEntity>;
  abstract getActiveUserByEmail(
    getActiveUserByEmail: GetActiveUserByEmailDTO
  ): Promise<UserEntity>;
  abstract updatePassword(
    updatePasswordDTO: UpdatePasswordDTO
  ): Promise<UserEntity>;
}