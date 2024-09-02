import { UserEntity } from "../../entities/auth";
import { UserModel } from "../../../data/mongodb/models/UserModel";
// Importar UserDocument y UserModel
import { ObjectId } from "mongodb"; // Importar ObjectId de mongodb

export class UserMapper {
  static toEntity(model: UserDocument): UserEntity {
    // Usar UserDocument como tipo
    return new UserEntity(
      model._id!.toString(),
      model.email,
      model.passwordHash,
      model.role // Asegurarse de incluir el rol al convertir a entidad
    );
  }

  static toModel(entity: UserEntity): UserModel {
    return {
      _id: entity.id ? new ObjectId(entity.id) : undefined,
      email: entity.email,
      passwordHash: entity.passwordHash,
      role: entity.role, // Asegurarse de incluir el rol al convertir a modelo
    };
  }
}
