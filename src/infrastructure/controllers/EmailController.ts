// src/controllers/EmailController.ts

import { Request, Response, NextFunction } from "express";
import logger from "../../core/adapters/logger";
import { SendEmailDTO, SendBulkEmailDTO } from "../../domain/dtos/email";
import { CustomError } from "../../domain/errors";
import { SendEmailUseCase } from "../../application/use-cases/email/send-email.use-case";

export class EmailController {
  constructor(
    private readonly sendEmailUseCase: SendEmailUseCase // private readonly sendBulkEmailsUseCase: SendBulkEmailsUseCase
  ) {}

  // Manejo de errores
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    logger.error(error);
    return res.status(500).send({ error: "Internal server error" });
  };

  /**
   * Enviar un email individual.
   */
  public sendEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log("Metodo de envio de emaail: ", req.body);
      const { to, subject, bodyText, bodyHtml } = req.body;

      const sendEmailDTO: SendEmailDTO = { to, subject, bodyText, bodyHtml };

      await this.sendEmailUseCase.execute(sendEmailDTO);
      res.status(200).json({ message: "Email enviado con éxito" });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  /**
   * Enviar múltiples emails en lote.
   */
  /*   public sendBulkEmails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { emails } = req.body;

      // Validación básica
      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({
          error: "El campo 'emails' es requerido y debe ser una lista no vacía",
        });
      }

      const sendBulkEmailDTO: SendBulkEmailDTO = { emails };

      await this.sendBulkEmailsUseCase.execute(sendBulkEmailDTO);
      res.status(200).json({ message: "Emails enviados con éxito" });
    } catch (error) {
      this.handleError(error, res);
    }
  }; */
}
