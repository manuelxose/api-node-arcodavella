import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../domain/errors/custom.errors";
import { RequestUserPayload } from "../../infrastructure/interfaces"; // Importa la interfaz

export class AdminMiddleware {
  /**
   * Middleware para verificar si el usuario tiene rol de administrador.
   * @param req Request - La solicitud HTTP.
   * @param res Response - La respuesta HTTP.
   * @param next NextFunction - La función para pasar al siguiente middleware.
   */
  public static isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body as RequestUserPayload; // Aplica la interfaz `UserPayload` a `req.user`

    if (user?.role !== "admin") {
      throw CustomError.unauthorized("Access denied. Admins only.");
    }

    next();
  };
}
