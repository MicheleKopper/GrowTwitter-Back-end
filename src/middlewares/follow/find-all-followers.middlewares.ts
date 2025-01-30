import { NextFunction, Request, Response } from "express";

export class FindAllFollowersMidlleware {
  static validateRequired(req: Request, res: Response, next: NextFunction) {
    const { id_usuario } = req.query;

    if (!id_usuario) {
      res.status(400).json({
        ok: false,
        message: "Informe o id_usuario!",
      });
    }
    next();
  }
}
