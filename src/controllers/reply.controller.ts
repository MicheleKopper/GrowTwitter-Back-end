import { query, Request, Response } from "express";
import { CreateReplyDto } from "../dtos/reply.dto";
import { ReplyService } from "../services/reply.service";
import { TweetType } from "@prisma/client";
import { log } from "console";

export class ReplyController {
  public static async create(req: Request, res: Response): Promise<void> {
    const { conteudo, type, idUsuario, idTweet } = req.body;

    // Chamar o serviço responsável
    const data: CreateReplyDto = {
      conteudo,
      type,
      idUsuario,
      idTweet,
    };

    const service = new ReplyService();
    const result = await service.create(data);

    // Retornar para o cliente as infos que o serviço retornar
    const { code, ...response } = result;
    res.status(code).json(response);
  }

  public static async findAll(req: Request, res: Response): Promise<void> {
    try {
      // 1 - Captura dos parâmetros da query
      const { id_reply } = req.query;

      // 2 - Chamar o serviço
      const service = new ReplyService();
      const result = await service.findAll(id_reply as string | undefined);

      // 3 - Retorna resposta para o cliente
      const { code, ...response } = result;
      res.status(code).json(response);
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: `Erro do servidor: ${error.message}`,
      });
    }
  }

  public static async findOneById(req: Request, res: Response): Promise<void> {
    try {
      // Captura o ID dos parâmetros da URL
      const { id_reply } = req.params;

      // Valida se o ID foi fornecido
      if (!id_reply) {
        res.status(400).json({
          ok: false,
          message: "O id_reply é obrigatório!",
        });
        return;
      }

      // Chama o serviço para buscar o reply
      const service = new ReplyService();
      const result = await service.findOneById(id_reply);

      // Retorna o resultado para o cliente
      const { code, ...response } = result;
      res.status(code).json(response);
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: `Erro do servidor: ${error.message}`,
      });
    }
  }

  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id_reply } = req.params;
      const { conteudo } = req.body;

      const service = new ReplyService();
      const result = await service.update(id_reply, { conteudo });

      const { code, ...response } = result;
      res.status(code).json(response);
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: `Erro do servidor: ${error.message}`,
      });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      // 1 - Pegar os dados (params: id e body: parâmetros)
      const { id_reply } = req.params;

      // 2 - Chamar o serviço para deletar
      const service = new ReplyService();
      const result = await service.delete(id_reply);

      // Retornar para o cliente
      const { code, ...response } = result;
      res.status(code).json(response);
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: `Erro do servidor: ${error.message}`,
      });
    }
  }
}
