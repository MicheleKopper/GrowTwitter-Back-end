import { Request, Response } from "express";
import { CreateFollowDto } from "../dtos/follow.dto";
import { FollowService } from "../services/follow.service";
// follower = seguidor
// following = seguindo

export class FollowController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      // Pegar os dados do body: parâmetros
      const { followerId, followingId } = req.body;

      // Montar o objeto DTO
      const data: CreateFollowDto = {
        followerId,
        followingId,
      };

      // Chamar o serviço responsável
      const service = new FollowService();
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

  public static async findAllFollowers(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // 1 - Pegar os dados do params: id
      const { id_usuario } = req.params;

      if (!id_usuario) {
        res.status(400).json({
          ok: false,
          message: "Informe o id_usuario!",
        });
      }

      //   2 - Chamar o service
      const service = new FollowService();
      const result = await service.findAllFollowers({
        id_usuario: id_usuario as string,
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
      // Pegar o followerId (usuário logado) e o following_id (usuário seguido)
      const { id_follow } = req.params;

      if (!id_follow) {
        res.status(400).json({
          ok: false,
          message: "O ID do follow é obrigatório!",
        });
        return;
      }

      // Chamar o serviço para deletar
      const service = new FollowService();
      const result = await service.delete(id_follow);

      // Retornar a resposta
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
