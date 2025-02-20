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
      // Todos os tweets incluindo as respostas (replies) de cada tweet
      include: {
        usuario: true, // Inclui o usuário que postou o tweet
        replies: {
          // Inclui as replies do tweet
          include: {
            usuario: true, // Inclui o usuário que fez a reply
          },
        },
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
    // Buscar o tweet pelo ID, incluindo o usuário e as respostas (replies)
    const tweet = await prisma.tweet.findUnique({
      where: { id_tweet: id_tweet },
      include: {
        usuario: true, // Incluindo o relacionamento com o usuário
        replies: {
          include: {
            usuario: true, // Incluindo o relacionamento do usuário nas respostas
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

    // Retornar o tweet encontrado com as relações
    return {
      ok: true,
      code: 200,
      message: "Tweet encontrado com sucesso!",
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

    // 2 - Atualizar o tweet no banco de dados
    const twitterUpdate = await prisma.tweet.update({
      where: { id_tweet },
      data: {
        conteudo: updateTwitter.conteudo || tweet.conteudo, // Usar o conteúdo existente se não for fornecido
        type: updateTwitter.type || tweet.type, // Usar o tipo existente se não for fornecido
        idTweetPai: updateTwitter.idTweetPai || tweet.idTweetPai, // Manter o idTweetPai atual se não for fornecido
      },
    });

    // 3 - Retornar os dados atualizados
    return {
      ok: true,
      code: 200,
      message: "Tweet atualizado com sucesso!",
      data: {
        id_tweet: twitterUpdate.id_tweet,
        idUsuario: twitterUpdate.idUsuario,
        conteudo: twitterUpdate.conteudo,
        type: twitterUpdate.type,
        idTweetPai: twitterUpdate.idTweetPai,
      },
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
      message: "Tweet deletado com sucesso!",
      data: tweetDelete,
    };
  }
}
