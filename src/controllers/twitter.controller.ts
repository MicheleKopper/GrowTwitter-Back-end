import { Request, Response } from "express";
import { prisma } from "../database/prisma.database";

export class TwitterController {
  public static async create(req: Request, res: Response): Promise<void> {
    const { conteudo, type, idUsuario, idTweetPai } = req.body;

    // CRIAÇÃO NO BANCO DE DADOS
    const tweetCriado = await prisma.tweet.create({
      data: {
        conteudo: conteudo,
        type: type,
        idUsuario: idUsuario,
        idTweetPai: idTweetPai,
      },
    });

    res.status(201).json({
      ok: true,
      message: "Tweet criado com sucesso!",
      data: tweetCriado,
    });
  }
}
