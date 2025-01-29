import { NextFunction, Request, Response } from "express";

export class CreateReplyMiddleware {
  public static validateRequired(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { conteudo, type, idUsuario, idTweet } = req.body;

    //VALIDAÇÃO DE DADOS
    if (!conteudo) {
      res.status(400).json({
        ok: false,
        message: "Preencha o conteúdo!",
      });
    }

    if (!type) {
      res.status(400).json({
        ok: false,
        message: "Preencha o tipo de Tweet!",
      });
    }

    if (!idUsuario) {
      res.status(400).json({
        ok: false,
        message: "Preencha o ID do usuário!",
      });
    }

      if (!idTweet) {
        res.status(400).json({
          ok: false,
          message: "Preencha o ID do Tweet!",
        });
      }
    next();
  }

  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { conteudo, type, idUsuario, idTweet } = req.body;

    //VALIDAÇÃO TIPO DE DADO
    if (typeof conteudo !== "string") {
      res.status(400).json({
        ok: false,
        message: "Conteúdo inválido!",
      });
    }

    if (type === "R" && !idTweet) {
      res.status(400).json({
        ok: false,
        message: "Reply deve referenciar ao Tweet original!",
      });
    }

    if (type !== "R") {
      res.status(400).json({
        ok: false,
        message: "Tweet precisa ser do tipo 'R' (Reply)!",
      });
    }
    next();
  }

  public static validateData(req: Request, res: Response, next: NextFunction) {
    const { conteudo, type, idUsuario, idTweet } = req.body;

    // VALIDAÇÃO ADICIONAL
    if (conteudo.length > 300) {
      res.status(400).json({
        ok: false,
        message: "O conteúdo deve ter no máximo 300 caracteres!",
      });
    }

    // conteudo.trim().length → Garante que não são aceitos apenas espaços em branco
    if (conteudo.trim() === "") {
      res.status(400).json({
        ok: false,
        message: "Preencha o conteúdo!",
      });
    }
    next();
  }
}
