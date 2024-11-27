// middlewares: Armazena funções intermediárias que podem modificar requisições e respostas antes que cheguem aos controladores, como autenticação e validação de dados.

import { NextFunction, Request, Response } from "express";

export class CreateUsuarioMiddleware {
  public static validateRequired(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { nome, username, email, senha } = req.body;

    // VALIDAÇÃO DE DADOS
    if (!nome) {
      res.status(400).json({
        ok: false,
        message: "Preencha o nome!",
      });
      return;
    }

    if (!username) {
      res.status(400).json({
        ok: false,
        message: "Preencha seu username!",
      });
      return;
    }

    if (!email) {
      res.status(400).json({
        ok: false,
        message: "Preencha seu email!",
      });
      return;
    }

    if (!senha) {
      res.status(400).json({
        ok: false,
        message: "Preencha sua senha!",
      });
      return;
    }
    next();
  }

  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { nome, username, email, senha } = req.body;

    // VALIDAÇÃO TIPO DE DADO
    if (typeof nome !== "string") {
      res.status(400).json({
        ok: false,
        message: "Nome inválido!",
      });
    }

    if (typeof username !== "string") {
      res.status(400).json({
        ok: false,
        message: "Username inválido!",
      });
    }

    if (typeof email !== "string") {
      res.status(400).json({
        ok: false,
        message: "Email inválido!",
      });
    }

    if (typeof senha !== "string") {
      res.status(400).json({
        ok: false,
        message: "Senha inválido!",
      });
    }

    next();
  }

  public static validateData(req: Request, res: Response, next: NextFunction) {
    const { nome, username, email, senha } = req.body;

    // VALIDAÇÃO ADICIONAL
    if (!email.includes("@") || !email.includes(".com")) {
      res.status(400).json({
        ok: false,
        message: "Email inválido!",
      });
    }

    if (senha.length < 4) {
      res.status(400).json({
        ok: false,
        message: "A senha deve ter mínimo de 4 carascteres!",
      });
    }
    
    next();
  }
}
