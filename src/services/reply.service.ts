import { prisma } from "../database/prisma.database";
import { CreateReplyDto, UpdateReplyDto } from "../dtos/reply.dto";
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

  public async findAll(id_reply?: string): Promise<ResponseApi> {
    try {
      const whereCondition = id_reply ? { id_reply } : {}; // Se não houver id, busca todos

      const replies = await prisma.reply.findMany({
        where: whereCondition,
      });

      return {
        ok: true,
        code: 200,
        message: "Replies listados com sucesso!",
        data: replies,
      };
    } catch (error: any) {
      return {
        ok: false,
        code: 500,
        message: `Erro ao buscar replies: ${error.message}`,
      };
    }
  }

  public async findOneById(id_reply: string): Promise<ResponseApi> {
    try {
      // Busca o reply pelo ID
      const reply = await prisma.reply.findUnique({
        where: { id_reply },
      });

      // Se não encontrar, retorna erro
      if (!reply) {
        return {
          ok: false,
          code: 404,
          message: "Reply não encontrado.",
        };
      }

      return {
        ok: true,
        code: 200,
        message: "Reply encontrado com sucesso!",
        data: reply,
      };
    } catch (error: any) {
      return {
        ok: false,
        code: 500,
        message: `Erro ao buscar reply: ${error.message}`,
      };
    }
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
