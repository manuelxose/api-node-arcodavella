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

    // Primero, obtener el usuario por el ID para obtener el email

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

    // Ahora, crear el DTO para obtener el miembro usando el email del usuario
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

    // Excluir el campo email y asignar el resto de los datos del miembro al DTO de actualización
    const { ...restMemberData } = member;

    // Unificar los datos del miembro con el updateProfileDTO
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
