// src/infrastructure/middlewares/LoginLoggerMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { LogRepository } from "../repositories";
import { RegisterLoginUseCase } from "../../application/use-cases/logs";
import { MongoLogsDatasource } from "../datasources/logs.mongodb.datasource";
import { RegisterLoginDTO } from "../../domain/dtos/logs";

export class LoginLoggerMiddleware {
  /**
   * Middleware para registrar inicios de sesión de usuarios.
   * @param req Request - La solicitud HTTP.
   * @param res Response - La respuesta HTTP.
   * @param next NextFunction - La función para pasar al siguiente middleware.
   */
  public static logLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("req.user: ", req.body);
      console.log("req.path: ", req.path);

      // Verifica que la ruta y el método sean los de login
      if (req.path === "/login" && req.method === "POST") {
        const user = req.body; // Asegúrate de que el middleware de autenticación anterior haya asignado req.user correctamente

        // Obtiene la dirección IP del cliente
        const ipAddress = LoginLoggerMiddleware.getClientIp(req);

        if (user?.email && ipAddress) {
          // Usualmente, el campo es 'email' en lugar de 'username'
          // Instanciar el uso de casos de uso
          const registerLoginUseCase = new RegisterLoginUseCase(
            new LogRepository(new MongoLogsDatasource())
          );

          console.log("user: ", user);

          // Crear el DTO para registrar el inicio de sesión
          const registerLoginDTO = RegisterLoginDTO.create({
            email: user.email,
            ipAddress,
          });

          // Registrar el inicio de sesión y obtener el conteo
          const loginCount = await registerLoginUseCase.execute(
            registerLoginDTO
          );
        }
      }
      next();
    } catch (error) {
      console.error("Error en LoginLoggerMiddleware:", error);
      next(error);
    }
  };

  /**
   * Método estático para obtener la dirección IP del cliente de manera más confiable.
   * @param req Request - La solicitud HTTP.
   * @returns string - La dirección IP del cliente.
   */
  private static getClientIp(req: Request): string {
    // Express proporciona req.ip que ya tiene en cuenta el 'trust proxy'
    const ip = req.ip;
    console.log("ip: ", ip);

    // Validación básica de la IP
    if (!ip) {
      return "";
    }

    // Manejar el caso de IPv6 y IPv4
    // Si la IP comienza con '::ffff:', es una representación IPv4
    if (ip.startsWith("::ffff:")) {
      return ip.substring(7);
    }

    return ip;
  }
}
