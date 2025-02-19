import { NextFunction, Request, Response } from "express";

export class UpdateReplyMiddleware {
  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { conteudo } = req.body;

    // Verifica se o conteúdo está ausente
    if (conteudo === undefined || conteudo === null) {
      res.status(400).json({
        ok: false,
        message: "Conteúdo é obrigatório!",
      });
      return;
    }

    // Verifica se o conteúdo é uma string
    if (typeof conteudo !== "string") {
      res.status(400).json({
        ok: false,
        message: "Conteúdo inválido!",
      });
      return;
    }

    next();
  }
}
