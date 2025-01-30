import { NextFunction, Request, Response } from "express";

export class FindAllReplyMidlleware {
  static validateRequired(req: Request, res: Response, next: NextFunction) {
    

    const { id_reply } = req.params;

    if (!id_reply) {
      res.status(400).json({
        ok: false,
        message: "O id_reply é obrigatório!",
      });
    }
    next();
  }
}
