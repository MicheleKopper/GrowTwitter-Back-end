import { Request, Response } from "express";
import { CreateTwitterDto } from "../dtos/twitter.dto";
import { TwitterService } from "../services/twitter.service";

export class TwitterController {
  public static async create(req: Request, res: Response): Promise<void> {
    const { conteudo, type, idUsuario, idTweetPai } = req.body;

    // Chamar o serviço responsável

    const data: CreateTwitterDto = {
      conteudo,
      type,
      idUsuario,
      idTweetPai,
    };

    const service = new TwitterService();
    const result = await service.create(data);

    // Retornar para o cliente as infos que o serviço retornar
    const { code, ...response } = result;
    res.status(code).json(response);
  }
}
