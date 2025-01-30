import { NextFunction, Request, Response } from "express";

export class UpdateReplyMiddleware {
  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { conteudo } = req.body;

    // VALIDAÇÃO TIPO DE DADO
    // se vier conteudo, entao valida se conteudo é uma string
    if (conteudo && typeof conteudo !== "string") {
      res.status(400).json({
        ok: false,
        message: "Conteúdo inválido!",
      });
    }
    next();
  }
}
