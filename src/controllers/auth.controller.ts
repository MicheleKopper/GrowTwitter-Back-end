import { Request, Response } from "express";
import { AuthService } from "../services";

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;

      // Chamar o serviço responsável
      
      const service = new AuthService();
      const result = await service.login({email, senha})

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
