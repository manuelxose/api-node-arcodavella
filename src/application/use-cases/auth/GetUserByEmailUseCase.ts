import { AuthRepository } from "../../../domain/repositories";
import { CustomError } from "../../../domain/errors/custom.errors";
import { GetActiveUserByEmailDTO } from "../../../domain/dtos/auth";
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  memberNumber?: string;
  status: string;
  phone: string;
  accountNumber: string;
  address: string;
}
export class GetUserByEmail {
  constructor(private authRepository: AuthRepository) {}

  async execute(
    getActiveUserByEmailDTO: GetActiveUserByEmailDTO
  ): Promise<UserResponse> {
    // Intentar obtener el usuario por email
    console.log("en el caso de uso:", getActiveUserByEmailDTO);
    const user = await this.authRepository.getActiveUserByEmail(
      getActiveUserByEmailDTO
    );

    if (!user) {
      throw CustomError.notFound("User not found");
    }

    // Devolver la información del usuario
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberNumber: user.memberNumber || "",
      status: user.status,
      phone: user.phone,
      accountNumber: user.accountNumber,
      address: user.address,
    };
  }
}
