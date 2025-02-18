import { NextFunction, Request, Response } from "express";



export class FindOneByIdMiddleware {
  static validateRequired(req: Request, res: Response, next: NextFunction) {
    const { id_reply } = req.params;

    if (!id_reply || id_reply.trim() === "" || id_reply === "undefined") {
    res.status(400).json({
        ok: false,
        message: "O id_reply é obrigatório!",
      });
        return; 
    }

    next();
  }
}
