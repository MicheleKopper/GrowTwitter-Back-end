import { Request, Response } from "express";
import { CreateFollowDto } from "../dtos/follow.dto";
import { FollowService } from "../services/follow.service";
// follower = seguidor
// following = seguindo

export class FollowController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
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
}
