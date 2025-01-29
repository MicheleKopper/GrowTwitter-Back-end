import { NextFunction, Request, Response } from "express";

export class FindAllReplyMidlleware {
  static validateRequired(req: Request, res: Response, next: NextFunction) {
    const { idTweet, type, idUsuario } = req.query;

    if (!idTweet) {
      res.status(400).json({
        ok: false,
        message: "O idTweet é obrigatório!",
      });
    }

    if (!idUsuario) {
      res.status(400).json({
        ok: false,
        message: "O idUsuario é obrigatório!",
      });
    }

    if (type !== "R") {
      res.status(400).json({
        ok: false,
        message: "O type deve ser 'R' (Reply) para buscar respostas!",
      });
    }
    next();
  }

  static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { idTweet, type, idUsuario } = req.query;

    if (type !== "R") {
      res.status(400).json({
        ok: false,
        message: "O type deve ser 'R' (Reply) para buscar respostas!",
      });
    }
    next();
  }
}
