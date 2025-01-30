import { prisma } from "../database/prisma.database";
import {
  CreateReplyDto,
  QueryFilterReplyDto,
  UpdateReplyDto,
} from "../dtos/reply.dto";
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
        id_reply: query.id_reply || undefined,
      },
    });

    return {
      ok: true,
      code: 200,
      message: "Replies listados com sucesso!",
      data: replies,
    };
  }

  public async findOneById(id_reply: string): Promise<ResponseApi> {
    // Como quero solicitar
    const reply = await prisma.reply.findUnique({
      where: { id_reply },
    });

    // Verificar se o reply existe
    if (!reply) {
      return {
        ok: false,
        code: 404,
        message: "Reply não encontrado!",
      };
    }

    // Retorna o reply encontrado
    return {
      ok: true,
      code: 200,
      message: "Reply encontrado!",
      data: reply,
    };
  }

  public async update(
    id_reply: string,
    updateReply: UpdateReplyDto
  ): Promise<ResponseApi> {
    // 1 - Verificar se o reply existe
    const reply = await prisma.reply.findUnique({
      where: { id_reply },
    });

    if (!reply) {
      return {
        ok: false,
        code: 404,
        message: "Reply não encontrado!",
      };
    }

    // 2 -  Atualizar o reply no banco de dados
    const replyUpdate = await prisma.reply.update({
      where: { id_reply },
      data: {
        conteudo: updateReply.conteudo,
      },
    });

    // 3 - Retornar os dados atualizados
    return {
      ok: true,
      code: 200,
      message: "Tweet atualizado com sucesso!",
      data: replyUpdate,
    };
  }

  public async delete(id_reply: string): Promise<ResponseApi> {
    // 1 - Verificar se o reply existe
    const reply = await prisma.reply.findUnique({
      where: { id_reply },
    });

    if (!reply) {
      return {
        ok: false,
        code: 404,
        message: "Reply não encontrado!",
      };
    }

    // 2 - Deletar o reply
    const replyDelete = await prisma.reply.delete({
      where: { id_reply },
    });

    // 3 - Retornar os dados
    return {
      ok: true,
      code: 200,
      message: "Reply deletado com sucesso!",
      data: replyDelete,
    };
  }
}
