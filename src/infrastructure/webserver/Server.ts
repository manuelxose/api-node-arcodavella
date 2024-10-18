import cors from "cors";
import express from "express";
import { AppRoutes } from "../../core/config/routeLoader";
import { errorHandler } from "../middlewares";
import cookieParser from "cookie-parser"; // <-- Importar cookie-parser
import { InitializeCronJobs } from "../../cron";

export class Server {
  private readonly app = express();
  private readonly CronJobs: InitializeCronJobs;
  constructor() {
    this.initServer();
    this.CronJobs = new InitializeCronJobs();
  }

  private async initServer() {
    // Middleware de express
    this.app.use(
      cors({
        origin: true, // Permitir solicitudes desde este origen
        credentials: true, // Permitir el envío de cookies
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Configuración de la ruta de la API
    this.app.set("trust proxy", true);

    // Carga dinámica de las rutas
    this.app.use(AppRoutes.routes);

    // Middleware de manejo de errores - debe estar al final
    this.app.use(errorHandler);

    // Ruta de prueba para verificar que el servidor está funcionando
    this.app.get("/", (req, res) => {
      res.send("API is running!");
    });
  }

  async start(port: number) {
    this.app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
