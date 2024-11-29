import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services";

export class AuthMiddleware {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    const service = new AuthService();
    const isValidUsuario = await service.validateToken(token);

    if (!isValidUsuario) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    req.body.usuario = {
      id_usuario: isValidUsuario.id_usuario,
      username: isValidUsuario.username,
    };

    next();
  }
}
