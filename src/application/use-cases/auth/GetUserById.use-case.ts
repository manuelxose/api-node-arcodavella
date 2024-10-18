import { GetUserByIdDTO } from "../../../domain/dtos/auth/GetUserByIdDTO";
import { CustomError } from "../../../domain/errors";
import { AuthRepository } from "../../../domain/repositories";

export class GetUserById {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: GetUserByIdDTO): Promise<any> {
    const user = await this.authRepo.getById(dto);

    if (!user) throw CustomError.notFound("User not Found");

    return user;
  }
}
