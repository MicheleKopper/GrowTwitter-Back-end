import { NextFunction, Request, Response } from "express";

export class FindAllMidlleware {
  static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { nome, username, email } = req.query;

    if (nome && typeof nome !== "string") {
      res.status(400).json({
        ok: false,
        message: "Nome deve ser uma string",
      });
    }

    if (username && typeof username !== "string") {
      res.status(400).json({
        ok: false,
        message: "Username deve ser uma string",
      });
    }

    if (email && typeof email !== "string") {
      res.status(400).json({
        ok: false,
        message: "Email deve ser uma string",
      });
    }
    next()
  }
}
