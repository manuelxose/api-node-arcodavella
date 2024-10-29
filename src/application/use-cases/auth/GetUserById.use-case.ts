import { GetUserByIdDTO } from "../../../domain/dtos/auth/GetUserByIdDTO";
import { CustomError } from "../../../domain/errors";
import { AuthRepository } from "../../../domain/repositories";

interface GetUserResponse {
  id: string;
  email: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetUserById {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: GetUserByIdDTO): Promise<GetUserResponse> {
    const user = await this.authRepo.getById(dto);

    if (!user) throw CustomError.notFound("User not Found");

    const response: GetUserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response;
  }
}
