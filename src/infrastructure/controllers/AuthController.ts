import { Request, Response, NextFunction } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import {
  RegisterUserDTO,
  LoginUserDTO,
  ChangePasswordDTO,
  UpdateProfileDTO,
  RequestPasswordResetDTO,
  GetActiveUserByEmailDTO,
  GetUserByIdDTO,
} from "../../domain/dtos/auth";
import {
  RegisterUser,
  LoginUser,
  ChangePassword,
  UpdateProfile,
  GetUserByEmail,
  GetAllSUsers,
  RequestPasswordReset,
} from "../../application/use-cases/auth";
import { NotificationRepository } from "../../domain/repositories";
import {
  NodemailerEmailRepository,
  MemberMongoRepository,
} from "../repositories";
import { CustomError } from "../../domain/errors";
import { GetUserById } from "../../application/use-cases/auth/GetUserById.use-case";

export class AuthController {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;
  private changePasswordUseCase: ChangePassword;
  private updateProfileUseCase: UpdateProfile;
  private requestResetPassUseCase: RequestPasswordReset;
  private getByEmailUseCase: GetUserByEmail;
  private getAllUsersUseCase: GetAllSUsers;
  private getUserByIdUseCase: GetUserById;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailRepository: NodemailerEmailRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly memebeRepository: MemberMongoRepository
  ) {
    // Casos de uso instanciados en el constructor
    this.registerUser = new RegisterUser(
      this.authRepository,
      this.notificationRepository
    );
    this.loginUser = new LoginUser(this.authRepository);
    this.changePasswordUseCase = new ChangePassword(this.authRepository);
    this.updateProfileUseCase = new UpdateProfile(
      this.authRepository,
      this.memebeRepository
    );
    this.requestResetPassUseCase = new RequestPasswordReset(
      this.authRepository,
      this.emailRepository
    );
    this.getByEmailUseCase = new GetUserByEmail(this.authRepository);
    this.getAllUsersUseCase = new GetAllSUsers(this.authRepository);
    this.getUserByIdUseCase = new GetUserById(this.authRepository);
  }

  // Método para enviar errores con respuesta personalizada
  private sendError(
    res: Response,
    error: Error,
    statusCode: number = 400
  ): Response {
    return res.status(statusCode).send({ error: error.message });
  }

  // Método para registrar un usuario
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) {
      return this.sendError(res, error, 400);
    }

    try {
      const result = await this.registerUser.execute(registerUserDTO!);
      res.status(201).json(result);
    } catch (err) {
      console.log("Salta el error aqui");
      next(err);
    }
  }

  // Método para iniciar sesión
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const [error, loginUserDTO] = LoginUserDTO.create(req.body);
    if (error) {
      return this.sendError(res, error, 400);
    }

    try {
      const response = await this.loginUser.execute(loginUserDTO!);
      res
        .cookie("access-token", response.token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60, // 1 hour
          secure: false, // poner a true en producción
        })
        .status(200)
        .json(response.user);
    } catch (err) {
      next(err);
    }
  }

  // Método para cerrar sesión
  public async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.authRepository.logout();
      res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      next(err);
    }
  }

  // Método para solicitar el restablecimiento de contraseña
  public async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const [error, requestPasswordResetDTO] = RequestPasswordResetDTO.create(
      req.body
    );
    if (error) {
      return this.sendError(res, error, 400);
    }

    try {
      await this.requestResetPassUseCase.execute(requestPasswordResetDTO!);
      res.status(200).json({ message: "Email to reset password sent" });
    } catch (err) {
      next(err);
    }
  }

  // Método para cambiar la contraseña
  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const [error, changePasswordDTO] = ChangePasswordDTO.create(req.body);
    if (error) {
      return this.sendError(res, error, 400);
    }

    try {
      await this.changePasswordUseCase.execute(changePasswordDTO!);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  }

  public async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { id } = req.params; // Obtener el ID de los parámetros
    const { status, ...userData } = req.body; // Desestructurar directamente del cuerpo
    console.log("Parámetros en el body:", req.body);
    console.log("Datos del usuario actualizados:", userData);
    console.log("status:", status);

    try {
      // Crear el DTO con validación
      const updateProfileDTO = UpdateProfileDTO.create({
        id, // Añadir el ID del usuario desde los parámetros
        ...userData.user, // Añadir los datos del usuario desde el cuerpo
        ...(status !== undefined && { status }), // Incluir 'status' si está presente
      });

      console.log("Datos en el DTO:", updateProfileDTO);

      // Ejecutar el caso de uso para actualizar el perfil
      await this.updateProfileUseCase.execute(updateProfileDTO);

      // Enviar una respuesta exitosa
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error: unknown) {
      // Manejo de errores
      if (error instanceof CustomError) {
        return this.sendError(res, error, 400);
      }

      // Manejar errores inesperados
      console.error("Error al actualizar el perfil:", error);
      next(error);
    }
  }

  // Método para obtener un usuario por email
  public async getByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { email } = req.query;

    const [error, getByEmailDTO] = GetActiveUserByEmailDTO.create({
      email: email as string,
    });

    if (error) {
      return this.sendError(res, error, 400);
    }

    try {
      const user = await this.getByEmailUseCase.execute(getByEmailDTO!);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  /* 
  Metodo para obtener un usuario por id

*/

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { id } = req.params; // Obtener el ID de los parámetros
    const [error, dto] = GetUserByIdDTO.create({ userId: id });
    if (error) {
      next(error);
      return;
    }
    try {
      const user = await this.getUserByIdUseCase.execute(dto!);
      // Crear el DTO con validación
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      console.log("Entra en el metodo getAll");
      const users = await this.getAllUsersUseCase.execute();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}
