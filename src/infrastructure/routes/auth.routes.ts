// src/infrastructure/routes/auth.routes.ts

import { Router } from "express";

import {
  MongoAuthDataSource,
  MongoMemberDataSource,
  MongoNotificationDataSource,
  NodemailerEmailDataSource,
} from "../datasources";

import {
  MemberMongoRepository,
  MongoAuthRepository,
  NodemailerEmailRepository,
  NotificationMongoRepository,
} from "../repositories";
import { AuthController } from "../controllers";
import { LoginLoggerMiddleware, AuthMiddleware } from "../middlewares";

export class AuthRoutes {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();

    // Crear instancias de DataSources
    const authDataSource = new MongoAuthDataSource();
    const emailDataSource = new NodemailerEmailDataSource();
    const notificationDataSource = new MongoNotificationDataSource();
    const memberDataSource = new MongoMemberDataSource();

    // Crear instancias de Repositories
    const authRepository = new MongoAuthRepository(authDataSource);
    const emailRepository = new NodemailerEmailRepository(emailDataSource);
    const notificationRepository = new NotificationMongoRepository(
      notificationDataSource
    );
    const memberRepository = new MemberMongoRepository(memberDataSource);

    // Crear instancia del controlador de autenticación
    this.authController = new AuthController(
      authRepository,
      emailRepository,
      notificationRepository,
      memberRepository
    );

    // Configurar rutas con middleware
    this.initializeRoutes();
  }

  /**
   * Inicializa las rutas de autenticación.
   */
  private initializeRoutes(): void {
    // Rutas más específicas primero
    // Ruta para obtener todos los usuarios (puede requerir autorización adicional)
    this.router.get(
      "/all",
      AuthMiddleware.validateAdminToken,
      this.authController.getAll.bind(this.authController)
    );

    // Ruta para obtener usuario por email
    this.router.get(
      "/",
      AuthMiddleware.validateAdminToken,
      this.authController.getByEmail.bind(this.authController)
    );

    // Ruta para obtener usuario por id
    this.router.get(
      "/:id",
      AuthMiddleware.validateAdminToken,
      this.authController.getById.bind(this.authController)
    );

    // Ruta para actualizar perfil de usuario
    this.router.put(
      "/:id",
      AuthMiddleware.validateAdminToken,
      this.authController.updateProfile.bind(this.authController)
    );

    // Rutas de autenticación
    // Ruta para iniciar sesión con registro de logins
    this.router.post(
      "/login",
      LoginLoggerMiddleware.logLogin,
      this.authController.login.bind(this.authController)
    );

    // Ruta para registrar un nuevo usuario
    this.router.post(
      "/register",
      this.authController.register.bind(this.authController)
    );

    // Ruta para cerrar sesión
    this.router.post(
      "/logout",
      AuthMiddleware.validateAdminToken,
      this.authController.logout.bind(this.authController)
    );

    // Ruta para cambiar contraseña
    this.router.post(
      "/change-password",
      //AuthMiddleware.validateAdminToken,
      this.authController.changePassword.bind(this.authController)
    );

    // Ruta para solicitar restablecimiento de contraseña
    this.router.post(
      "/forgot-password",
      this.authController.resetPassword.bind(this.authController)
    );

    // Ruta para restablecer contraseña
    this.router.post(
      "/reset-password",
      this.authController.updateProfile.bind(this.authController)
    );
  }

  /**
   * Retorna el objeto Router configurado.
   * @returns Router
   */
  public getRoutes(): Router {
    return this.router;
  }
}

const authRoutesInstance = new AuthRoutes();
const router = authRoutesInstance.getRoutes();

export { router };
