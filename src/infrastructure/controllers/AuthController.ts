import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.errors";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { NodemailerEmailRepository } from "../repositories/sendEmal.repositoy";
import {
  RegisterUserDTO,
  LoginUserDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
  UpdateProfileDTO,
  RequestPasswordResetDTO,
} from "../../domain/dtos/auth";
import {
  RegisterUser,
  LoginUser,
  ResetPassword,
  ChangePassword,
  UpdateProfile,
} from "../../application/use-cases/auth";
import logger from "../../core/adapters/logger";
import fs from "fs";
import path from "path";
import { RequestPasswordReset } from "../../application/use-cases/auth/RequestPasswordReset";

export class AuthController {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;
  private changePasswordUseCase: ChangePassword;
  private updateProfileUseCase: UpdateProfile;
  private requestResetPassUseCase: RequestPasswordReset;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailRepository: NodemailerEmailRepository
  ) {
    this.registerUser = new RegisterUser(this.authRepository);
    this.loginUser = new LoginUser(this.authRepository);
    this.changePasswordUseCase = new ChangePassword(this.authRepository);
    this.updateProfileUseCase = new UpdateProfile(this.authRepository);
    this.requestResetPassUseCase = new RequestPasswordReset(
      this.authRepository,
      this.emailRepository
    );
  }

  private handleError(error: unknown, res: Response) {
    const logPath = path.join(__dirname, "../../../logs/errors.log");

    if (error instanceof CustomError) {
      res.status(error.statusCode).send({ error: error.message });
    } else {
      logger.error(error);
      res.status(500).send({ error: "Internal server error" });
    }

    // Log error to file
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${error}\n`);
  }

  public async register(req: Request, res: Response): Promise<void> {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) {
      res.status(400).send({ error: error.message });
      return;
    }

    try {
      const response = await this.registerUser.execute(registerUserDTO!);
      res.status(201).send(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    const [error, loginUserDTO] = LoginUserDTO.create(req.body);
    if (error) {
      res.status(400).send({ error: error.message });
      return;
    }

    try {
      const response = await this.loginUser.execute(loginUserDTO!);
      res.status(200).send(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async logout(req: Request, res: Response): Promise<void> {
    try {
      await this.authRepository.logout();
      res.status(200).send({ message: "Logout successful" });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    const [error, requestPasswordResetDTO] = RequestPasswordResetDTO.create(
      req.body
    );
    if (error) {
      res.status(400).send({ error: error.message });
      return;
    }

    try {
      await this.requestResetPassUseCase.execute(requestPasswordResetDTO!);
      res.status(200).send({ message: "Email to reseset sent" });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const [error, changePasswordDTO] = ChangePasswordDTO.create(req.body);
    if (error) {
      res.status(400).send({ error: error.message });
      return;
    }

    try {
      await this.changePasswordUseCase.execute(changePasswordDTO!);
      res.status(200).send({ message: "Password changed successfully" });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<void> {
    const [error, updateProfileDTO] = UpdateProfileDTO.create(req.body);
    if (error) {
      res.status(400).send({ error: error.message });
      return;
    }

    try {
      await this.updateProfileUseCase.execute(updateProfileDTO!);
      res.status(200).send({ message: "Profile updated successfully" });
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
