import { AuthRepository } from "../../../domain/repositories";
import { UpdateProfileDTO } from "../../../domain/dtos/auth";

export class UpdateProfile {
  constructor(private authRepository: AuthRepository) {}

  async execute(updateProfileDTO: UpdateProfileDTO): Promise<void> {
    return this.authRepository.updateProfile(updateProfileDTO);
  }
}
