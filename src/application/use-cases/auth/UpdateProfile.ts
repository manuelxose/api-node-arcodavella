import { AuthRepository, MemberRepository } from "../../../domain/repositories";
import { GetActiveUserDTO, UpdateProfileDTO } from "../../../domain/dtos/auth";
import { GetMemberByEmailDTO } from "../../../domain/dtos/member";
import { CustomError } from "../../../domain/errors";

export class UpdateProfile {
  constructor(
    private authRepository: AuthRepository,
    private memberRepository: MemberRepository
  ) {}

  async execute(updateProfileDTO: UpdateProfileDTO): Promise<void> {
    console.log("Actualización de perfil: ", updateProfileDTO);

    // Obtener el usuario por el ID para obtener el email
    const [error, activeUserDTO] = GetActiveUserDTO.create({
      userId: updateProfileDTO.id,
    });
    if (error) {
      throw CustomError.notFound("No se ha encontrado usuario activo");
    }

    const user = await this.authRepository.getActiveUser(activeUserDTO!);
    if (!user || !user.email) {
      throw CustomError.notFound(
        `Usuario con ID ${updateProfileDTO.id} no encontrado`
      );
    }

    // Crear el DTO para obtener el miembro usando el email del usuario
    const [emailError, memberDTO] = GetMemberByEmailDTO.create(user.email);
    if (emailError) {
      throw CustomError.badRequest(
        `Error al crear el DTO para obtener el miembro: ${emailError.message}`
      );
    }

    // Obtener los datos del miembro desde el repositorio usando el DTO con email
    const member = await this.memberRepository.getMemberByEmail(memberDTO!);
    if (!member) {
      throw CustomError.notFound(
        `Miembro con email ${user.email} no encontrado`
      );
    }

    // Use a self-invoking function to omit 'id' and 'email'
    const restMemberData = (() => {
      const { id, email, ...rest } = member;
      return rest;
    })();

    // Unificar los datos del miembro con el updateProfileDTO sin sobrescribir el 'id' del usuario
    Object.assign(updateProfileDTO, restMemberData);

    console.log(
      "Perfil actualizado con los datos del miembro: ",
      updateProfileDTO
    );

    // Realizar la actualización del perfil
    await this.authRepository.updateProfile(updateProfileDTO);

    console.log("Perfil actualizado correctamente.");
  }
}
