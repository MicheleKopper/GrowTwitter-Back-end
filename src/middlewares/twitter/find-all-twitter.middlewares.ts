import { NextFunction, Request, Response } from "express";

export class FindAllTwitterMiddleware {
  static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { type } = req.query;

    // Verificação de tipo para 'type' (apenas 'Tweet' ou 'Reply' são válidos)
    if (type && type !== "Tweet" && type !== "Reply") {
      res.status(400).json({
        ok: false,
        message: "O tipo deve ser 'Tweet' ou 'Reply'",
      });
      return;
    }

    next();
  }
}
