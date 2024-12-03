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
}
