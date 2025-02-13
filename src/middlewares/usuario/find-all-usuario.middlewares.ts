import { NextFunction, Request, Response } from "express";

export class FindAllMidlleware {
  static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { idUsuario, idTweet } = req.query;

    if (idUsuario && !isNaN(Number(idUsuario))) {
      res.status(400).json({
        ok: false,
        message: "Id do usuário deve ser uma string válida, não um número",
      });
      return;
    }

    if (idTweet && !isNaN(Number(idTweet))) {
      res.status(400).json({
        ok: false,
        message: "Id do tweet deve ser uma string válida, não um número",
      });
      return;
    }
    next();
  }
}
