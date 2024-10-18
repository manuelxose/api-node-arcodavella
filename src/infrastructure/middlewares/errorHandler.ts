import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../domain/errors/custom.errors";
import logger from "../../core/adapters/logger";
import fs from "fs/promises";
import path from "path";
import { error } from "console";

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("Entra el middleware de ErrorHandler");
  console.log("err: ", err);
  if (res.headersSent) {
    // Si los encabezados ya se han enviado, delega al manejador de errores predeterminado de Express
    return next(err);
  }

  try {
    if (err instanceof CustomError) {
      console.log("Es custom error", err.message);

      res
        .status(err.statusCode)
        .json({ message: err.message, statusCode: err.statusCode });
    } else {
      logger.error(err.message);

      // Registrar el error en el archivo de logs
      await logErrorToFile(err);

      res.status(500).json({ error: "Internal server error" });
    }
  } catch (loggingError) {
    logger.error("Error handling failed: ", loggingError);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Registra el error en un archivo de logs.
 * @param err Error - El error que se debe registrar.
 */
async function logErrorToFile(err: Error): Promise<void> {
  const logPath = path.join(__dirname, "../../../logs/errors.log");

  const logMessage = `${new Date().toISOString()} - ${err.message}\n`;

  try {
    await fs.appendFile(logPath, logMessage);
  } catch (fileError) {
    logger.error("Failed to write to log file: ", fileError);
  }
}
