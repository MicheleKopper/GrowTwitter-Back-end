import { NextFunction, Request, Response } from "express";

export class UpdateTwitterMiddleware {
  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { conteudo, type, idTweetPai } = req.body;

    // VALIDAÇÃO TIPO DE DADO
    // se vier conteudo, entao valida se conteudo é uma string
    if (conteudo && typeof conteudo !== "string") {
      res.status(400).json({
        ok: false,
        message: "Conteúdo inválido!",
      });
    }

    if (type === "R" && !idTweetPai && typeof idTweetPai !== "string") {
      res.status(400).json({
        ok: false,
        message: "idTweetPai deve ser uma string válida!",
      });
    }

    if (type !== "T" && type !== "R") {
      res.status(400).json({
        ok: false,
        message: "Tweet precisa ser do tipo 'T' ou 'R'!",
      });
    }

    if (!(type === "T" || type === "R")) {
      res.status(400).json({
        ok: false,
        message: "Tipo de tweet inválido!",
      });
    }

    next();
  }
}
