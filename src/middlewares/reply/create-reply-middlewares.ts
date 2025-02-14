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
      return
    }

    if (!type) {
      res.status(400).json({
        ok: false,
        message: "Preencha o tipo de Tweet!",
      });
      return
    }

    if (!idUsuario) {
      res.status(400).json({
        ok: false,
        message: "Preencha o ID do usuário!",
      });
      return
    }

      if (!idTweet) {
        res.status(400).json({
          ok: false,
          message: "Preencha o ID do Tweet!",
        });
        return
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
      return
    }

    if (type === "R" && !idTweet) {
      res.status(400).json({
        ok: false,
        message: "Reply deve referenciar ao Tweet original!",
      });
      return
    }

    if (type !== "R") {
      res.status(400).json({
        ok: false,
        message: "Tweet precisa ser do tipo 'R' (Reply)!",
      });
      return
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
      return
    }

    // conteudo.trim().length → Garante que não são aceitos apenas espaços em branco
    if (conteudo.trim() === "") {
      res.status(400).json({
        ok: false,
        message: "Preencha o conteúdo!",
      });
      return
    }
    next();
  }
}
