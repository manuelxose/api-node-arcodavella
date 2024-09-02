import { AuthRepository } from "../../domain/repositories";
import {
  LoginUserDTO,
  RegisterUserDTO,
  UpdateProfileDTO,
  ResetPasswordDTO,
  GetActiveUserByEmailDTO,
  UpdatePasswordDTO,
} from "../../domain/dtos/auth";
import { UserEntity } from "../../domain/entities/auth";
import { GetActiveUserDTO } from "../../domain/dtos/auth";
import { AuthDataSource } from "../../domain/datasources";

export class MongoAuthRepository implements AuthRepository {
  constructor(private readonly dataSource: AuthDataSource) {}

  login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
    return this.dataSource.login(loginUserDTO);
  }

  logout(): Promise<void> {
    return this.dataSource.logout();
  }

  register(registerUserDTO: RegisterUserDTO): Promise<UserEntity> {
    return this.dataSource.register(registerUserDTO);
  }

  resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    return this.dataSource.resetPassword(resetPasswordDTO);
  }

  updateProfile(updateProfileDTO: UpdateProfileDTO): Promise<void> {
    return this.dataSource.updateProfile(updateProfileDTO);
  }

  getActiveUser(getActiveUserDTO: GetActiveUserDTO): Promise<UserEntity> {
    return this.dataSource.getActiveUser(getActiveUserDTO);
  }

  getActiveUserByEmail(
    getActiveUserByEmailDTO: GetActiveUserByEmailDTO
  ): Promise<UserEntity> {
    return this.dataSource.getActiveUserByEmail(getActiveUserByEmailDTO);
  }
  updatePassword(updatePasswordDTO: UpdatePasswordDTO): Promise<UserEntity> {
    return this.dataSource.updatePassword(updatePasswordDTO);
  }
}
