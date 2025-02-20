import { Request, Response, NextFunction } from "express";

export class UpdateLikeMiddleware {
  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { idUsuario, idTweet } = req.body;

    // VALIDAÇÃO TIPO DE DADO
    if (idUsuario && typeof idUsuario !== "string") {
      res.status(400).json({
        ok: false,
        message: "Id Usuário precisa ser uma string!",
      });
      return
    }

    if (idTweet && typeof idTweet !== "string") {
      res.status(400).json({
        ok: false,
        message: "Id Usuário precisa ser uma string!",
      });
      return
    }

    next();
  }

  public static validateData(req: Request, res: Response, next: NextFunction) {
    const { idUsuario, idTweet } = req.body;

    if (!idUsuario && !idTweet) {
      res.status(400).json({
        ok: false,
        message: "Ao menos um campo (idUsuario ou idTweet) deve ser fornecido!",
      });
      return
    }

    next();
  }
}
