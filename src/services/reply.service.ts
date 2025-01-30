import { prisma } from "../database/prisma.database";
import { CreateReplyDto, QueryFilterReplyDto } from "../dtos/reply.dto";
import { ResponseApi } from "../types";

export class ReplyService {
  public async create(createReply: CreateReplyDto): Promise<ResponseApi> {
    try {
      const { conteudo, type, idUsuario, idTweet } = createReply;

      const replyCriado = await prisma.reply.create({
        data: { conteudo, type, idUsuario, idTweet },
      });

      return {
        ok: true,
        code: 201,
        message: "Resposta criada com sucesso!",
        data: replyCriado,
      };
    } catch (error) {
      return {
        ok: false,
        code: 500,
        message: "Erro ao criar resposta.",
      };
    }
  }

  public async findAll(query: QueryFilterReplyDto): Promise<ResponseApi> {
    const replies = await prisma.reply.findMany({
      // Como quero solicitar
      where: {
        idTweet: query.idTweet || undefined,
      },
    });

    return {
      ok: true,
      code: 200,
      message: "Replies listados com sucesso!",
      data: replies,
    };
  }
}
