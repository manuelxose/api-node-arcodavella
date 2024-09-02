import { Request, Response, NextFunction } from "express";
import { GetActiveUserDTO } from "../../domain/dtos/auth";
import { JwtAdapter } from "../../core/adapters";
import { MongoAuthRepository } from "../../infrastructure/repositories";
import { MongoAuthDataSource } from "../../infrastructure/datasources";
import { GetActiveUser } from "../../application/use-cases/auth"; // Suponiendo que ActiveUser es un caso de uso

export class AuthMiddleware {
  private authRepository: MongoAuthRepository;
  private activeUser: GetActiveUser;

  constructor() {
    const authDataSource = new MongoAuthDataSource(); // Asegúrate de que AuthDataSource esté implementado correctamente
    this.authRepository = new MongoAuthRepository(authDataSource);
    this.activeUser = new GetActiveUser(this.authRepository);
  }

  public validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.header("Authorization");

    if (!authorization) {
      return res.status(401).send({ error: "No token provided" });
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).send({ error: "Invalid Bearer token" });
    }

    const token = authorization.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({ error: "No token provided" });
    }

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        return res.status(401).send({ error: "Invalid Token payload" });
      }

      const [error, getActiveUserDTO] = GetActiveUserDTO.create({
        userId: payload.id,
      });

      if (error || !getActiveUserDTO) {
        return res.status(400).send({ error: "Invalid user data" });
      }

      const response = await this.activeUser.execute(getActiveUserDTO);

      if (!response) {
        return res.status(401).send({ error: "User not found or inactive" });
      }

      req.body.user = payload; // Añadir el usuario activo a la solicitud
      next();
    } catch (error) {
      console.error("Error in validateToken middleware:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };
}
