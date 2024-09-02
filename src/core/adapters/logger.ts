import { createLogger, transports, format } from "winston";
import path from "path";

const logsDirectory = path.join(__dirname, "../../../logs");

// Configuramos el formato común para ambos tipos de logs
const logFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  })
);

const logger = createLogger({
  level: "info", // El nivel por defecto es 'info', pero puedes especificar otros al loguear.
  format: logFormat,
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colores para la consola
        logFormat
      ),
    }),
    new transports.File({
      filename: path.join(logsDirectory, "error.log"),
      level: "error", // Solo los errores se loguean aquí
      format: logFormat,
    }),
    new transports.File({
      filename: path.join(logsDirectory, "access.log"),
      level: "info", // Info y superior se loguean aquí
      format: logFormat,
    }),
  ],
});

// Exporta el logger para que pueda ser utilizado en otras partes de la aplicación
export default logger;
