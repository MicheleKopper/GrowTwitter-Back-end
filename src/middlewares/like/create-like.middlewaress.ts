import { NextFunction, Request, Response } from "express";

export class CreateLikeMiddleware {
  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { idUsuario, idTweet } = req.body;

    // VALIDAÇÃO TIPO DE DADO
    if (!idUsuario || typeof idUsuario !== "string") {
      res.status(400).json({
        ok: false,
        message: "idUsuario deve ser uma string!",
      });
    }

    if (!idTweet || typeof idTweet !== "string") {
      res.status(400).json({
        ok: false,
        message: "idTweet deve ser uma string!",
      });
    }

    next();
  }
}
