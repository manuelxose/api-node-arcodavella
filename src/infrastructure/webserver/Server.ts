// server.ts
import cors from "cors";
import express from "express";
import { AppRoutes } from "../../core/config/routeLoader";
import { errorHandler } from "../middlewares";
import cookieParser from "cookie-parser";
import { InitializeCronJobs } from "../../cron";

export class Server {
  private readonly app = express();
  private readonly CronJobs: InitializeCronJobs;
  private readonly allowedOrigins = [
    "https://portal.arcodavella.gal",
    "http://localhost:4200",
    "https://www.portal.arcodavella.gal",
  ];

  constructor() {
    this.initServer();
    this.CronJobs = new InitializeCronJobs();
  }

  private async initServer() {
    // Configuración de CORS
    const corsOptions: cors.CorsOptions = {
      origin: (origin, callback) => {
        // Permitir solicitudes sin origen (como herramientas de prueba)
        if (!origin) return callback(null, true);
        if (this.allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("No permitido por CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      optionsSuccessStatus: 204, // Algunos navegadores antiguos no soportan 204
    };

    // Aplicar middleware de CORS antes de las rutas
    this.app.use(cors(corsOptions));

    // Otros middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Configuración de confianza en proxy (si usas proxies como Nginx)
    this.app.set("trust proxy", true);

    // Carga dinámica de rutas
    this.app.use(AppRoutes.routes);

    // Middleware de manejo de errores - debe estar al final
    this.app.use(errorHandler);

    // Ruta de prueba para verificar que el servidor está funcionando
    this.app.get("/", (req, res) => {
      res.send("API está funcionando!");
    });
  }

  async start(port: number) {
    this.app.listen(port, "0.0.0.0", () => {
      console.log(`Servidor ejecutándose en el puerto ${port}`);
    });
  }
}
