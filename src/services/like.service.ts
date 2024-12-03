import { prisma } from "../database/prisma.database";
import { CreateLikeDto, QueryFilterLikeDto } from "../dtos/like.dto";
import { ResponseApi } from "../types";

export class LikeService {
  public async create(createLike: CreateLikeDto): Promise<ResponseApi> {
    const { idUsuario, idTweet } = createLike;

    // VALIDAÇÃO DE COLUNA ÚNICA - // VERIRFICAR SE O TWEET EXISTE
    const tweet = await prisma.tweet.findUnique({
      where: { id_tweet: idTweet },
    });

    if (!tweet) {
      return {
        ok: false,
        code: 409,
        message: "Tweet não encontrado!",
      };
    }

    // VALIDAÇÃO DE COLUNA ÚNICA - // VERIRFICAR SE O LIKE EXISTE
    const like = await prisma.like.findFirst({
      where: { idUsuario, idTweet },
    });

    if (like) {
      return {
        ok: false,
        code: 409,
        message: "Você já deu like neste tweet!",
      };
    }

    // CRIAÇÃO DO LIKE NO BANCO DE DADOS
    const likeCriado = await prisma.like.create({
      data: {
        idUsuario,
        idTweet,
      },
    });

    return {
      ok: true,
      code: 201,
      message: "Like adicionado com sucesso!",
      data: likeCriado,
    };
  }

  public async findAll(query: QueryFilterLikeDto): Promise<ResponseApi> {

    const likes = await prisma.like.findMany({
      where: query,
      include: {
        usuario: true,
        tweet: true,
      },
    });

    return {
      ok: true,
      code: 200,
      message: "Likes encontrados com sucesso!",
      data: likes,
    };
  }
}
