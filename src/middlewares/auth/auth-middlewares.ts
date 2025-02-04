import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services";
import { JWT } from "../../utils/jwt";

export class AuthMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    // Bearer
    const [_, token] = authorization.split(" ");

    const jwt = new JWT();
    const userDecoded = jwt.verifyToken(token);

    if (!userDecoded) {
      res.status(401).json({
        ok: false,
        message: "Não autenticado!",
      });
      return;
    }

    req.body.usuario = {
      id_usuario: userDecoded.id,
      username: userDecoded.name,
    };

    next();
  }
}
