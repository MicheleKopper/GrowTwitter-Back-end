import {
  CreateTwitterDto,
  QueryFilterTwitterDto,
  UpdateTwitterDto,
} from "../dtos/twitter.dto";
import { ResponseApi } from "../types";
import { prisma } from "../database/prisma.database";

export class TwitterService {
  public async create(createTwitter: CreateTwitterDto): Promise<ResponseApi> {
    const { conteudo, type, idUsuario, idTweetPai } = createTwitter;

    // Criação no banco de dados
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

  public async findAll(query: QueryFilterTwitterDto): Promise<ResponseApi> {
    const twitter = await prisma.tweet.findMany({
      where: {
        conteudo: { contains: query.conteudo, mode: "insensitive" },
        type: query.type || undefined,
      },
    });

    return {
      ok: true,
      code: 200,
      message: "Tweets listados com sucesso!",
      data: twitter,
    };
  }

  public async findOneById(id_tweet: string): Promise<ResponseApi> {
    // Buscar o tweet pelo ID
    const tweet = await prisma.tweet.findUnique({
      where: { id_tweet: id_tweet },
      include: {
        usuario: true,
        replies: {
          include: {
            usuario: true,
          },
        },
      },
    });

    // Verificar se o tweet existe
    if (!tweet) {
      return {
        ok: false,
        code: 404,
        message: "Tweet não encontrado!",
      };
    }

    // Retornar o tweet encontrado
    return {
      ok: true,
      code: 200,
      message: "Tweet encontrado!",
      data: tweet,
    };
  }

  public async update(
    id_tweet: string,
    updateTwitter: UpdateTwitterDto
  ): Promise<ResponseApi> {
    // 1 - Verificar se o tweet existe
    const tweet = await prisma.tweet.findUnique({
      where: { id_tweet },
    });

    if (!tweet) {
      return {
        ok: false,
        code: 404,
        message: "Tweet não encontrado!",
      };
    }

    // 2 -  Atualizar o tweet no banco de dados
    const twitterUpdate = await prisma.tweet.update({
      where: { id_tweet: id_tweet },
      data: {
        conteudo: updateTwitter.conteudo,
        type: updateTwitter.type,
        idTweetPai: updateTwitter.idTweetPai,
      },
    });

    // 3 - Retornar os dados atualizados
    return {
      ok: true,
      code: 200,
      message: "Tweet atualizado com sucesso!",
      data: twitterUpdate,
    };
  }

  public async delete(id_tweet: string): Promise<ResponseApi> {
    // 1 - Verificar se o o tweet existe
    const tweet = await prisma.tweet.findUnique({
      where: { id_tweet },
    });

    if (!tweet) {
      return {
        ok: false,
        code: 404,
        message: "Tweet não encontrado!",
      };
    }

    // 2 - Deletar o usuário
    const tweetDelete = await prisma.tweet.delete({
      where: { id_tweet },
    });

    // 3 - Retornar os dados
    return {
      ok: true,
      code: 200,
      message: "Usuário deletado com sucesso!",
      data: tweetDelete,
    };
  }
}
