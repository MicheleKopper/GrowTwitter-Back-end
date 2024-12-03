import { Request, Response } from "express";
import { CreateTwitterDto } from "../dtos/twitter.dto";
import { TwitterService } from "../services/twitter.service";
import { TweetType } from "@prisma/client";

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

  public static async findAll(req: Request, res: Response): Promise<void> {
    try {
      // 1 - pegar do query
      const { conteudo, type } = req.query;

      // 2 - Chamar o serviço
      const service = new TwitterService();
      const result = await service.findAll({
        conteudo: conteudo as string | undefined,
        type: type as TweetType,
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

  public static async findOneById(req: Request, res: Response): Promise<void> {
    try {
      // 1 - Pegar o id do params
      const { id_tweet } = req.params;

      // 2 - Chamar o serviço
      const service = new TwitterService();
      const result = await service.findOneById(id_tweet);

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

  public static async update(req: Request, res: Response): Promise<void> {
    try {
      // 1 - Pegar os dados (params: id e body: parâmetros)
      const { id_tweet } = req.params;
      const { conteudo, type, idTweetPai } = req.body;

      // 2 - Chamar o serviço
      const service = new TwitterService();
      const result = await service.update(id_tweet, {
        conteudo,
        type,
        idTweetPai,
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

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      // 1 - Pegar os dados (params: id e body: parâmetros)
      const { id_tweet } = req.params;

      // 2 - Chamar o serviço para deletar
      const service = new TwitterService();
      const result = await service.delete(id_tweet);

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
