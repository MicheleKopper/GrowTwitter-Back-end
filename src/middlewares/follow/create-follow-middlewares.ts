import { NextFunction, Request, Response } from "express";

export class CreateFollowMiddleware {
  public static validateRequired(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      res.status(400).json({
        ok: false,
        code: 400, // Adicionar isso para manter o padrão
        message: "Preencha os IDs do seguidor e seguido!",
      });
      return;
    }

    if (followerId === followingId) {
      res.status(400).json({
        ok: false,
        code: 400, // Adicionar isso também
        message: "Você não pode seguir a si mesmo!",
      });
      return;
    }

    next();
  }
}
