import { prisma } from "../database/prisma.database";
import { CreateFollowDto } from "../dtos/follow.dto";
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
}
