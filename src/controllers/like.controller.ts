import { CreateLikeDto } from "../dtos/like.dto";
import { LikeService } from "../services/like.service";
import { Request, Response } from "express";

export class LikeController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { idUsuario, idTweet } = req.body;

      // Validação básica
      if (!idUsuario || !idTweet) {
        res.status(400).json({
          ok: false,
          message: "Usuário e Tweet são obrigatórios!",
        });
        return;
      }

      // Montar o objeto DTO
      const data: CreateLikeDto = {
        idUsuario,
        idTweet,
      };

      // Chamar o serviço responsável
      const service = new LikeService();
      const result = await service.create(data);

      // Retornar para o cliente as infos que o serviço retornar
      const { code, ...response } = result;
      res.status(code).json(response);
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: `Erro do servidor: ${error.message}`,
      });
    }
  }

  public static async findAll(req: Request, res: Response): Promise<void> {
    try {
      // 1 - pegar do query
      const { idUsuario, idTweet } = req.query;

      // 2 - Chamar o serviço
      const service = new LikeService();

      const result = await service.findAll({
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

  public static async findOneById(req: Request, res: Response): Promise<void> {
    try {
      // 1 - Pegar o id do params
      const { id_usuario } = req.params;

      // 2 - Chamar o serviço
      const service = new LikeService();
      const result = await service.findOneById(id_usuario);

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
      const { id_like } = req.params;
      const { idUsuario, idTweet } = req.body;

      // 2 - Chamar o serviço
      const service = new LikeService();
      const result = await service.update(id_like, idUsuario, idTweet);

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
      const { id_like } = req.params;

      // 2 - Chamar o serviço para deletar
      const service = new LikeService();
      const result = await service.delete(id_like);

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
