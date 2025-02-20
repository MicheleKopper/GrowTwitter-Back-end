import { Request, Response, NextFunction } from "express";

export class FindAllLikeMidlleware {
  static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { idUsuario, idTweet } = req.query;

    if (idUsuario && typeof idUsuario !== "string") {
      res.status(400).json({
        ok: false,
        message: "Id do usuário deve ser uma string",
      });
      return;
    }

    if (idTweet && typeof idTweet !== "string") {
      res.status(400).json({
        ok: false,
        message: "Id do tweet deve ser uma string",
      });
      return;
    }

    next();
  }
}
