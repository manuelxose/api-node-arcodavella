import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../core/adapters";
import { CustomError } from "../../domain/errors";
import { RequestUserPayload } from "../../infrastructure/interfaces"; // Importa la interfaz

export class AuthMiddleware {
  /**
   * Middleware para validar el token JWT y verificar si el usuario es administrador.
   * @param req Request - La solicitud HTTP.
   * @param res Response - La respuesta HTTP.
   * @param next NextFunction - La función para pasar al siguiente middleware.
   */
  public static validateAdminToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Extraer el token desde las cookies en lugar del encabezado Authorization
      const token = AuthMiddleware.extractToken(req);

      if (!token) {
        throw CustomError.unauthorized("No token provided");
      }

      // Validar el token JWT
      const payload = await JwtAdapter.validateToken<RequestUserPayload>(token);

      if (!payload) {
        throw CustomError.unauthorized("Invalid token");
      }

      // Verificar si el usuario tiene el rol de administrador
      if (payload.role !== "admin") {
        throw CustomError.forbidden("User is not authorized");
      }

      // Continuar al siguiente middleware
      next();
    } catch (error) {
      next(error); // Pasar el error al middleware de manejo de errores
    }
  };

  /**
   * Extrae el token desde las cookies.
   * @param req Request - La solicitud HTTP.
   * @returns El token extraído o null si no es válido.
   */
  private static extractToken(req: Request): string | null {
    // Extraer la cookie llamada 'access-token'
    const token = req.cookies["access-token"];
    return token || null; // Devolver el token o null si no existe
  }
}
