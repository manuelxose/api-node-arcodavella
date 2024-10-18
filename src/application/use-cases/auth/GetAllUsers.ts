import { CustomError } from "../../../domain/errors";
import { AuthRepository } from "../../../domain/repositories";

export class GetAllSUsers {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<any> {
    // Fetch all users from the auth repository
    const users = await this.authRepository.getAll();
    if (!users) {
      CustomError.notFound("No users found");
    }
    // Return the list of users
    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        dni: user.dni,
        memberNumber: user.memberNumber,
      })),
    };
  }
}
