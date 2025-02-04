import { prisma } from "../database/prisma.database";
import { CreateFollowDto, QueryFilterDto } from "../dtos/follow.dto";
import { ResponseApi } from "../types";

// follower = seguidor
// following = seguindo

export class FollowService {
  public async create(createFollow: CreateFollowDto): Promise<ResponseApi> {
    try {
      const { followerId, followingId } = createFollow;

      // VALIDAÇÃO SE JÁ ESTÁ SEGUINDO
      const follow = await prisma.follow.findFirst({
        where: { followerId, followingId },
      });

      if (follow) {
        return {
          ok: false,
          code: 409,
          message: "Você já está seguindo este usuário!",
        };
      }

      // CRIAÇÃO NO BANCO DE DADOS
      const followCriado = await prisma.follow.create({
        data: { followerId, followingId },
      });

      return {
        ok: true,
        code: 201,
        message: "Agora você está seguindo este usuário!",
        data: followCriado,
      };
    } catch (error: any) {
      return {
        ok: false,
        code: 500,
        message: `Erro ao seguir usuário: ${error.message}`,
      };
    }
  }

  public async findAllFollowers(query: QueryFilterDto): Promise<ResponseApi> {
    const { id_usuario } = query;

    if (!id_usuario) {
      return {
        ok: false,
        code: 400,
        message: "ID do usuário é obrigatório!",
      };
    }

    // Buscar seguidores no banco de dados
    const followers = await prisma.follow.findMany({
      where: { followingId: id_usuario },
      select: {
        follower: {
          select: {
            id_usuario: true,
            username: true,
            nome: true,
          },
        },
      },
    });

    return {
      ok: true,
      code: 200,
      message: "Seguidores listados com sucesso!",
      data: followers.map((f) => f.follower),
    };
  }

  public async delete(id_follow: string): Promise<ResponseApi> {
    // Verificar se existe o seguidor
    const follow = await prisma.follow.findUnique({
      where: {
        id_follow,
      },
    });

    if (!follow) {
      return {
        ok: false,
        code: 404,
        message: "Você não esta seguindo este usuário!",
      };
    }

    // Deletar o seguidor
    const followingDelete = await prisma.follow.delete({
      where: {
        id_follow,
      },
    });

    return {
      ok: true,
      code: 200,
      message: "Seguidor deletado com sucesso!",
      data: followingDelete,
    };
  }
}
