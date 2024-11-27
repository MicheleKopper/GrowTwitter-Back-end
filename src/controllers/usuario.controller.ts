// controllers: É responsável por receber e processar as requisições HTTP e delegam a lógica de negócios a serviços.

import { Request, Response } from "express";
import { prisma } from "../database/prisma.database";

export class UsuarioController {
  public static async create(req: Request, res: Response)

  const { nome, username, email, senha } = req.body;

  // VALIDAÇÃO DE COLUNA ÚNICA
  const usuario = await prisma.usuario.findUnique({
    where: { email: email },
  });

  if (usuario && usuario.email === email) {
  return res.status(400).json({
      ok: false,
      message: "Este email já está em uso!",
    });
    
  }

  // CRIAÇÃO NO BANCO DE DADOS
  const usuarioCriado = await prisma.usuario.create({
    data: {
      nome: nome,
      username: username,
      email: email,
      senha: senha,
    },
  });

  return res.status(201).json({
        ok: true,
        message: "Usuário cadastrado com sucesso!",
        data: usuarioCriado,
      });
}
