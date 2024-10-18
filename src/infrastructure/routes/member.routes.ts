import { Router } from "express";
import { MemberController } from "../controllers";
import { MongoMemberDataSource } from "../datasources";
import { AuthMiddleware } from "../middlewares";
import { MemberMongoRepository } from "../repositories";

export class MemberRoutes {
  static get routes(): Router {
    const router = Router();

    const memberDataSource = new MongoMemberDataSource();
    const memberRepository = new MemberMongoRepository(memberDataSource);

    const memberController = new MemberController(memberRepository);

    router.post(
      "/create",
      AuthMiddleware.validateAdminToken,
      memberController.create.bind(memberController)
    );
    router.put(
      "/:id",
      AuthMiddleware.validateAdminToken,
      memberController.update.bind(memberController)
    );
    router.delete(
      "/:id",
      AuthMiddleware.validateAdminToken,
      memberController.delete.bind(memberController)
    );
    router.get(
      "/all", // Asegúrate de que esta ruta esté correctamente definida
      AuthMiddleware.validateAdminToken,
      memberController.getAll.bind(memberController)
    );
    router.get(
      "/:id",
      AuthMiddleware.validateAdminToken,
      memberController.getById.bind(memberController)
    );

    router.post(
      "/initialize",
      AuthMiddleware.validateAdminToken,
      memberController.initialize.bind(memberController)
    );

    return router;
  }
}

const memberRoutes = MemberRoutes.routes;

export { memberRoutes as router };
