import { NextFunction, Request, Response } from "express";
import { JWT } from "../../utils/jwt";

export class AuthMiddleware {
  public static async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    //Busca o dado
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        ok: false,
        message: "Não autorizado! Token obrigatório",
      });
      return;
    }

    //Desestrutura o bearer token para usar somente o token
    const token = authorization.split(" ")[1];

    if (!token || !authorization.startsWith("Bearer")) {
      res.status(401).json({
        ok: false,
        message: "Não autorizado! Token inválido ou ausente",
      });
      return;
    }

    const jwt = new JWT();

    const userDecoded = jwt.verifyToken(token);

    if (!userDecoded) {
      res.status(401).json({
        ok: false,
        message: "Não autorizado! Token inválido ou expirado",
      });
      return;
    }

    req.body.usuario = {
      id_usuario: userDecoded.id,
      nome: userDecoded.nome,
      username: userDecoded.username,
      email: userDecoded.email,
    };

    next();
  }
}

// export class AuthMiddleware {
//   public static async validate(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     const authorization = req.headers.authorization;

//     if (!authorization) {
//       res.status(401).json({
//         ok: false,
//         message: "Não autenticado!",
//       });
//       return;
//     }

//     // Bearer
//     const [_, token] = authorization.split(" ");

//     const jwt = new JWT();
//     const userDecoded = jwt.verifyToken(token);

//     if (!userDecoded) {
//       res.status(401).json({
//         ok: false,
//         message: "Não autenticado!",
//       });
//       return;
//     }

//     req.body.usuario = {
//       id_usuario: userDecoded.id,
//       username: userDecoded.name,

//     };

//     next();
//   }
// }
