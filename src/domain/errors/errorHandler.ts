import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../domain/errors/custom.errors";
import logger from "../../core/adapters/logger";
import fs from "fs";
import path from "path";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const logPath = path.join(__dirname, "../../../logs/errors.log");

  if (res.headersSent) {
    // Si los encabezados ya se han enviado, delega al manejador de errores predeterminado de Express
    return next(err);
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    logger.error(err.message);

    // Guardar el error en el archivo de logs
    fs.appendFileSync(
      logPath,
      `${new Date().toISOString()} - ${err.message}\n`
    );

    res.status(500).json({ error: "Internal server error" });
  }
}
