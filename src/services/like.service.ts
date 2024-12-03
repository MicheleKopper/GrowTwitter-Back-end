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

  public async findOneById(idUsuario: string): Promise<ResponseApi> {
    // 1 - Buscar
    const likes = await prisma.like.findMany({
      where: { idUsuario },
      include: { usuario: true, tweet: true },
    });

    // 2 - Validar se existir
    if (likes.length === 0) {
      return {
        ok: false,
        code: 404,
        message: "Nenhum like encontrado para este usuário!",
      };
    }
    // 3 - Retornar o dado
    return {
      ok: true,
      code: 200,
      message: "Likes encontrados!",
      data: likes,
    };
  }

  public async update(
    id_like: string,
    newIdUsuario?: string,
    newIdTweet?: string
  ): Promise<ResponseApi> {
    // 1 - Verificar se o like existe
    const like = await prisma.like.findUnique({
      where: { id_like },
    });

    if (!like) {
      return {
        ok: false,
        code: 404,
        message: "Like não encontrado!",
      };
    }

    // 2 - Atualizar (prisma)
    const likeUpdate = await prisma.like.update({
      where: { id_like },
      data: { idUsuario: newIdUsuario, idTweet: newIdTweet },
    });

    // 3 - Retornar os dados
    return {
      ok: true,
      code: 200,
      message: "Like atualizado com sucesso!",
      data: likeUpdate,
    };
  }

  public async delete(id_like: string): Promise<ResponseApi> {
    // 1 - Verificar se o like existe
    const like = await prisma.like.findUnique({
      where: { id_like },
    });

    if (!like) {
      return {
        ok: false,
        code: 404,
        message: "Like não encontrado!",
      };
    }

    // 2 - Deletar o like
    const likeDelete = await prisma.like.delete({
      where: { id_like },
    });

    // 3 - Retornar os dados
    return {
      ok: true,
      code: 200,
      message: "Like deletado com sucesso!",
      data: likeDelete,
    };
  }
}
