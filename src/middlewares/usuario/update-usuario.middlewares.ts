import { Request, Response, NextFunction } from "express";

export class UpdateUsuarioMiddleware {
  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { nome, username } = req.body;

    // VALIDAÇÃO TIPO DE DADO
    if (nome && typeof nome !== "string") {
      res.status(400).json({
        ok: false,
        message: "Nome inválido!",
      });
      return;
    }

    if (username && typeof username !== "string") {
      res.status(400).json({
        ok: false,
        message: "Username inválido!",
      });
      return;
    }

    next();
  }

  public static validateData(req: Request, res: Response, next: NextFunction) {
    const { nome, username } = req.body;

    if (nome && nome.length < 3) {
      res.status(400).json({
        ok: false,
        message: "Nome deve conter mínimo 3 caracteres!",
      });
      return;
    }

    if (username && username.length < 3) {
      res.status(400).json({
        ok: false,
        message: "Username deve conter mínimo 3 caracteres!",
      });
      return;
    }
    
    next();
  }
}
