import {
  GetActiveUserDTO,
  ResetPasswordDTO,
  UpdatePasswordDTO,
} from "../dtos/auth";
import {
  LoginUserDTO,
  RegisterUserDTO,
  UpdateProfileDTO,
  GetActiveUserByEmailDTO,
} from "../dtos/auth";
import { GetUserByIdDTO } from "../dtos/auth/GetUserByIdDTO";
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
  abstract getAll(): Promise<UserEntity[]>;

  abstract getById(dto: GetUserByIdDTO): Promise<UserEntity>;
}
