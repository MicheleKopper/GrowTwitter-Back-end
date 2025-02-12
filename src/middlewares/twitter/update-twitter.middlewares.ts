import { NextFunction, Request, Response } from "express";

export class UpdateTwitterMiddleware {
  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { conteudo, type, idTweetPai } = req.body;

    // VALIDAÇÃO TIPO DE DADO
    if (conteudo === undefined || conteudo === null || conteudo === "") {
      res.status(400).json({
        ok: false,
        message: "Conteúdo é obrigatório!",
      });
      return;
    }

    // 'type' deve ser 'T' ou 'R'
    if (type !== "T" && type !== "R") {
      res.status(400).json({
        ok: false,
        message: "Tweet precisa ser do tipo 'T' ou 'R'!",
      });
      return;
    }

    // 'idTweetPai' se o tipo for 'R' (resposta)
    if (type === "R" && (!idTweetPai || typeof idTweetPai !== "string")) {
      res.status(400).json({
        ok: false,
        message: "idTweetPai deve ser uma string válida!",
      });
      return;
    }

    next();
  }
}
