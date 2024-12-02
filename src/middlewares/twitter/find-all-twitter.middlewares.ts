import { NextFunction, Request, Response } from "express";

export class FindAllTwitterMidlleware {
  static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { conteudo, type } = req.query;

    if (conteudo && typeof conteudo !== "string") {
      res.status(400).json({
        ok: false,
        message: "Conteúdo deve ser uma string",
      });
    }

    if (type && type !== "Tweet" && type !== "Reply") {
      res.status(400).json({
        ok: false,
        message: "O tipo deve ser 'Tweet' ou 'Reply'",
      });
    }

    next();
  }
}
