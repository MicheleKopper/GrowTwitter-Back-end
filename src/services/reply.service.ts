import { prisma } from "../database/prisma.database";
import { CreateReplyDto, QueryFilterReplyDto } from "../dtos/reply.dto";
import { ResponseApi } from "../types";

export class ReplyService {
  public async create(createReply: CreateReplyDto): Promise<ResponseApi> {
    const { conteudo, type, idUsuario, idTweet } = createReply;

    // Criação no banco de dados
    const replyCriado = await prisma.reply.create({
      data: {
        conteudo: conteudo,
        type: type,
        idUsuario: idUsuario,
        idTweet: idTweet,
      },
    });

    return {
      ok: true,
      code: 201,
      message: "Resposta criada com sucesso!",
      data: replyCriado,
    };
  }

  public async findAll(query: QueryFilterReplyDto): Promise<ResponseApi>{
    const replies = await prisma.reply.findMany({
      where: {
        type: query.type || undefined,
        idUsuario: query.idUsuario || undefined,
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
