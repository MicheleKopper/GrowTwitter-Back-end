import { Request, Response } from "express";
import { CreateReplyDto } from "../dtos/reply.dto";
import { ReplyService } from "../services/reply.service";
import { TweetType } from "@prisma/client";

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
      const { type, idUsuario, idTweet } = req.query;

      // 2 - Chamar o serviço
      const service = new ReplyService();
      const result = await service.findAll({
        type: type as TweetType | undefined,
        idUsuario: idUsuario as string | undefined,
        idTweet: idTweet as string | undefined,
      });

      // 3 - Retornar para o cliente as infos que o serviço retornar
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
