import { CreateTwitterDto } from "../dtos/twitter.dto";
import { ResponseApi } from "../types";
import { prisma } from "../database/prisma.database";

export class TwitterService {
  public async create(createTwitter: CreateTwitterDto): Promise<ResponseApi> {
    const { conteudo, type, idUsuario, idTweetPai } = createTwitter;

    // CRIAÇÃO NO BANCO DE DADOS
    const tweetCriado = await prisma.tweet.create({
      data: {
        conteudo: conteudo,
        type: type,
        idUsuario: idUsuario,
        idTweetPai: idTweetPai,
      },
    });

    return {
      ok: true,
      code: 201,
      message: "Tweet criado com sucesso!",
      data: tweetCriado,
    };
  }
}
