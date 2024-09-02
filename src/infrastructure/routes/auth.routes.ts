import { Router } from "express";
import { AuthController } from "../controllers";
import { AuthMiddleware } from "../middlewares";
import { MongoAuthDataSource, NodemailerEmailDataSource } from "../datasources";
import {
  MongoAuthRepository,
  NodemailerEmailRepository,
} from "../repositories";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    // Crear instancias de DataSources y Repositories
    const authDataSource = new MongoAuthDataSource();
    const emailDataSource = new NodemailerEmailDataSource();

    const authRepository = new MongoAuthRepository(authDataSource);
    const emailRepository = new NodemailerEmailRepository(emailDataSource);

    // Crear instancia del controlador de autenticación
    const authController = new AuthController(authRepository, emailRepository);
    const authMiddleware = new AuthMiddleware();

    router.post("/login", authController.login.bind(authController));
    router.post("/register", authController.register.bind(authController));
    router.post(
      "/logout",
      // authMiddleware.validateToken.bind(authMiddleware),
      authController.logout.bind(authController)
    );
    router.post(
      "/change-password",
      // authMiddleware.validateToken.bind(authMiddleware),
      authController.changePassword.bind(authController)
    );
    router.post(
      "/reset-password",
      authController.resetPassword.bind(authController)
    );
    router.post(
      "/update-profile",
      // authMiddleware.validateToken.bind(authMiddleware),
      authController.updateProfile.bind(authController)
    );

    return router;
  }
}

const authRoutes = AuthRoutes.routes;

export { authRoutes as router };
