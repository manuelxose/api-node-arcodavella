import { GetUserByIdDTO } from "../../../domain/dtos/auth/GetUserByIdDTO";
import { UserEntity } from "../../../domain/entities/auth";
import { CustomError } from "../../../domain/errors";
import { AuthRepository } from "../../../domain/repositories";

export class GetUserById {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: GetUserByIdDTO): Promise<UserEntity> {
    const user = await this.authRepo.getById(dto);

    if (!user) throw CustomError.notFound("User not Found");

    return user;
  }
}
