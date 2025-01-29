import { Request, Response } from "express";
import { CreateReplyDto } from "../dtos/reply.dto";
import { ReplyService } from "../services/reply.service";

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
}
