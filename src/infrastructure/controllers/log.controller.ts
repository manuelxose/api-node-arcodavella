import { NextFunction } from "express";
import { GetLogsByEmailDTO } from "../../domain/dtos/logs";
import { LogRepository } from "../repositories";
import { GetLogsByEmailUseCase } from "../../application/use-cases/logs/getLogsByEmail.use-case";
import { Request, Response } from "express";

export class LogController {
  private getLogsByEmailUseCase: GetLogsByEmailUseCase;

  constructor(private logRepository: LogRepository) {
    // Casos de uso instanciados en el constructor
    this.getLogsByEmailUseCase = new GetLogsByEmailUseCase(this.logRepository);
  }

  private sendError(
    res: Response,
    error: Error,
    statusCode: number = 400
  ): Response {
    return res.status(statusCode).send({ error: error.message });
  }

  async getLogsByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    // Property 'email' does not exist on type 'ReadableStream<Uint8Array> | null'.ts(2339)

    const { email } = req.query;

    if (!email) {
      return this.sendError(res, new Error("Email is required"), 400);
    }

    const getLogsByEmailDTO = GetLogsByEmailDTO.create({
      email: email as string,
    });

    try {
      const logs = await this.logRepository.getLogsByEmail(getLogsByEmailDTO!);
      res.status(200).json(logs);
    } catch (err) {
      next(err);
    }
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const logs = await this.logRepository.getAll();
      res.status(200).json(logs);
    } catch (err) {
      next(err);
    }
  }
}
