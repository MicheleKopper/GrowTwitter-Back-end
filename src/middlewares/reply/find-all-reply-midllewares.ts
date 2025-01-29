import { NextFunction, Request, Response } from "express";

export class FindAllReplyMidlleware {
  static validateRequired(req: Request, res: Response, next: NextFunction) {
    console.log(req.params);

    const { idTweet } = req.params;

    if (!idTweet) {
      res.status(400).json({
        ok: false,
        message: "O idTweet é obrigatório!",
      });
    }
    next();
  }
}
