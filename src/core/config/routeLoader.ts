import { Router } from "express";
import path from "path";
import { FileHandler } from "../utils/fileHandler"; // Ajusta la ruta a donde se encuentra FileHandler

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    const PATH_ROUTER = path.join(__dirname, "../../infrastructure/routes");

    console.log("Path: ", PATH_ROUTER);
    console.log("Loading routers...");

    // Inicializar FileHandler con la ruta al directorio de rutas
    const fileHandler = new FileHandler(PATH_ROUTER);

    // Listar archivos en el directorio con filtros para extensiones .ts y .js
    const routeFiles = [
      ...fileHandler.listFiles(PATH_ROUTER, ".ts"),
      ...fileHandler.listFiles(PATH_ROUTER, ".js"),
    ];

    console.log("Files found:", routeFiles); // Log para verificar los archivos encontrados

    routeFiles.forEach((file) => {
      try {
        const routePath = path.join(PATH_ROUTER, file);
        console.log(`Attempting to load: ${routePath}`); // Log para cada archivo que se intenta cargar
        const routeModule = require(routePath);

        // Asegúrate de usar la exportación correcta
        const route = routeModule.default || routeModule.router || routeModule;

        if (route && typeof route === "function") {
          const routeName = file
            .replace(/\.ts$|\.js$/, "")
            .replace(".routes", "");
          router.use(`/api/${routeName}`, route);
          console.log(`Loaded route: /api/${routeName}`);
        } else {
          console.warn(`WARNING: The file ${file} does not export a router.`);
        }
      } catch (error: any) {
        console.log("ERROR EN EL LOADER: ", error.message);
      }
    });

    return router;
  }
}
