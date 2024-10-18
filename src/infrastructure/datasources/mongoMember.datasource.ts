import {
  CreateMemberDTO,
  UpdateMemberDTO,
  GetMemberByIdDTO,
  DeleteMemberDTO,
  InitializeMembersDTO,
  GetMemberByEmailDTO,
} from "../../domain/dtos/member";
import MemberModel from "../../data/mongodb/models/MemberModel";
import { CustomError } from "../../domain/errors";
import { MemberEntity } from "../../domain/entities/members/MemberEntity";
import { MemberMapper } from "../mapppers";
import { MemberDataSource } from "../../domain/datasources";
import logger from "../../core/adapters/logger";

export class MongoMemberDataSource implements MemberDataSource {
  // Create a new member
  async createMember(createMemberDTO: CreateMemberDTO): Promise<MemberEntity> {
    const member = await MemberModel.findOne({
      email: createMemberDTO.email,
    });

    if (member) throw CustomError.badRequest("Member already exists");

    const newMember = new MemberModel({
      name: createMemberDTO.name,
      email: createMemberDTO.email,
      dni: createMemberDTO.dni,
      comments: "",
      memberNumber: createMemberDTO.memberNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newMember.save();

    return MemberMapper.toEntity(newMember);
  }

  // Update an existing member's details
  async updateMember(updateMemberDTO: UpdateMemberDTO): Promise<MemberEntity> {
    // Verificar si el email ya está en uso por otro miembro
    if (updateMemberDTO.email) {
      const existingMemberWithEmail = await MemberModel.findOne({
        email: updateMemberDTO.email,
      });

      if (
        existingMemberWithEmail &&
        existingMemberWithEmail._id.toString() !== updateMemberDTO.id
      ) {
        throw CustomError.badRequest("Email already in use by another member");
      }
    }

    // Verificar si el dni ya está en uso por otro miembro
    if (updateMemberDTO.dni) {
      const existingMemberWithDni = await MemberModel.findOne({
        dni: updateMemberDTO.dni,
      });

      if (
        existingMemberWithDni &&
        existingMemberWithDni._id.toString() !== updateMemberDTO.id
      ) {
        throw CustomError.badRequest("DNI already in use by another member");
      }
    }

    // Actualizar el miembro, asegurándonos de incluir el campo comments
    const updatedMember = await MemberModel.findByIdAndUpdate(
      updateMemberDTO.id,
      {
        name: updateMemberDTO.name,
        email: updateMemberDTO.email,
        dni: updateMemberDTO.dni,
        memberNumber: updateMemberDTO.memberNumber,
        comments: updateMemberDTO.comments, // Asegúrate de que comments está siendo enviado
        updatedAt: new Date(), // Actualiza manualmente el campo updatedAt
      },
      { new: true, runValidators: true } // Devuelve el documento actualizado y aplica validaciones
    );

    if (!updatedMember) {
      throw CustomError.notFound("Member not found");
    }

    return MemberMapper.toEntity(updatedMember);
  }

  // Delete a member by their ID
  async deleteMember(deleteMemberDTO: DeleteMemberDTO): Promise<void> {
    const { id } = deleteMemberDTO;

    console.log("id a borrar: ", id);

    const result = await MemberModel.findByIdAndDelete(id);
    if (!result) {
      throw CustomError.notFound("Member not found");
    }
  }

  // Get a member by their ID
  async getMemberById(getMemberDTO: GetMemberByIdDTO): Promise<MemberEntity> {
    const member = await MemberModel.findById(getMemberDTO.id);
    if (!member) {
      throw CustomError.notFound("Member not found");
    }

    return MemberMapper.toEntity(member);
  }

  //Get a member by email

  async getMemberByEmail(
    getMemberByEmailDTO: GetMemberByEmailDTO
  ): Promise<MemberEntity> {
    const member = await MemberModel.findOne({
      email: getMemberByEmailDTO.email,
    });

    if (!member) throw CustomError.notFound("Member not found");

    return MemberMapper.toEntity(member);
  }

  // Get all members in the system
  async getAllMembers(): Promise<MemberEntity[]> {
    logger.info("getAllMembers: Start retrieving all members");

    try {
      logger.info("getAllMembers: Initiating database query for members");

      const members = await MemberModel.find();

      // Log para verificar si se encontró algún miembro
      if (!members) {
        logger.warn("getAllMembers: No members object returned from database");
        throw CustomError.notFound("No members found");
      }

      // Comprobación para ver si el array de miembros está vacío
      if (members.length === 0) {
        logger.warn("getAllMembers: Members array is empty");
        throw CustomError.notFound("No members found");
      }

      logger.info(`getAllMembers: ${members.length} members found`);

      // Mapeamos los miembros al formato de la entidad
      const memberEntities = members.map((member) => {
        logger.debug(`getAllMembers: Mapping member ID ${member._id}`);
        return MemberMapper.toEntity(member);
      });

      logger.info("getAllMembers: Successfully retrieved and mapped members");

      return memberEntities;
    } catch (error: unknown) {
      // Manejo de errores inesperados
      if (error instanceof CustomError) {
        logger.error(`getAllMembers: Error encountered - ${error.message}`);

        throw error; // Re-lanzamos errores conocidos
      } else {
        throw CustomError.internal(
          "An error occurred while retrieving members"
        );
      }
    }
  }

  // Initialize members in bulk, deleting pre-existing records
  async initializeMembers(
    initializeMembersDTO: InitializeMembersDTO
  ): Promise<void> {
    try {
      // Validar que haya miembros para insertar
      if (
        !initializeMembersDTO.members ||
        initializeMembersDTO.members.length === 0
      ) {
        throw CustomError.badRequest("Member list cannot be empty.");
      }

      // Crear un conjunto de datos únicos para los miembros, verificando duplicados en el campo `email`
      const seenEmails = new Set<string>(); // Usar un Set para rastrear correos electrónicos únicos
      const memberDocuments = initializeMembersDTO.members.map(
        (memberDTO, index) => {
          const email = memberDTO.email || `EMAIL_MISSING_${index}`;
          let comments = memberDTO.comments || "";

          // Si el correo electrónico ya existe en el Set, agregar un comentario pero no saltarlo
          if (seenEmails.has(email)) {
            console.warn(`Duplicate email detected: ${email}.`);
            comments += ` Duplicate email detected: ${email}.`; // Agregar comentario del problema
          }

          // Agregar el correo al Set de correos únicos
          seenEmails.add(email);

          // Verificar si hay campos faltantes y agregar problemas en los comentarios
          if (!memberDTO.name) {
            console.warn(
              `Member is missing the 'name'. Assigning 'NAME_MISSING'.`
            );
            comments += ` Missing name.`;
          }
          if (!memberDTO.dni) {
            console.warn(
              `Member ${memberDTO.name} is missing the 'dni'. Assigning 'DNI_MISSING'.`
            );
            comments += ` Missing dni.`;
          }
          if (!memberDTO.memberNumber) {
            console.warn(
              `Member ${memberDTO.name} is missing the 'memberNumber'. Assigning 'MEMBERNUMBER_MISSING'.`
            );
            comments += ` Missing member number.`;
          }

          return {
            name: memberDTO.name || `NAME_MISSING_${index}`,
            email, // Usar el correo ya procesado
            dni: memberDTO.dni || `DNI_MISSING_${index}`,
            memberNumber:
              memberDTO.memberNumber || `MEMBERNUMBER_MISSING_${index}`,
            comments: comments.trim(), // Agregar los comentarios de los problemas encontrados
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
      );

      console.log("Total de datos a insertar:", memberDocuments.length);
      console.log("Primer miembro:", memberDocuments[0]); // Mostrar el primer miembro como referencia

      // Eliminar todos los miembros existentes en la base de datos
      await MemberModel.deleteMany({});
      console.log("Miembros antiguos eliminados.");

      // Insertar los nuevos miembros
      await MemberModel.insertMany(memberDocuments);
      console.log("Nuevos miembros insertados.");
    } catch (error: unknown) {
      console.error("Error capturado:", error); // Mostrar el error completo para depuración

      // Verificar si el error tiene `keyPattern` antes de intentar acceder
    }
  }
}
