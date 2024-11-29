import { NextFunction, Request, Response } from "express";

export class LoginMiddleware {
  public static validateRequired(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email, senha } = req.body;

    if (!email) {
      res.status(400).json({
        ok: false,
        message: "Email obrigatório!",
      });
    }

    if (!senha) {
      res.status(400).json({
        ok: false,
        message: "Senha obrigatória!",
      });
    }
    next();
  }

  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { email, senha } = req.body;

    if (typeof email !== "string") {
      res.status(400).json({
        ok: false,
        message: "Email deve ser uma string!",
      });
    }

    if (typeof senha !== "string") {
      res.status(400).json({
        ok: false,
        message: "Senha obrigatória!",
      });
    }
    next();
  }
}
