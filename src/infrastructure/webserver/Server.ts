import cors from "cors";
import express from "express";
import { AppRoutes } from "../../core/config/routeLoader";

export class Server {
  private readonly app = express();

  constructor() {
    this.initServer();
  }

  private async initServer() {
    // Middleware de express
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //carga dinamica de las rutas

    this.app.use(AppRoutes.routes);

    // Ruta de prueba para verificar que el servidor está funcionando
    this.app.get("/", (req, res) => {
      res.send("API is running!");
    });
  }

  async start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
