// controllers: É responsável por receber e processar as requisições HTTP e delegam a lógica de negócios a serviços.

import { Request, response, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { CreateUsuarioDto } from "../dtos";

export class UsuarioController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { nome, username, email, senha } = req.body;

      // Montar o objeto DTO
      const data: CreateUsuarioDto = {
        nome,
        username,
        email,
        senha,
      };

      // Chamar o serviço responsável
      const service = new UsuarioService();
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
      const { nome, username, email } = req.query;

      // 2 - Chamar o serviço
      const service = new UsuarioService();
      const result = await service.findAll({
        nome: nome as string | undefined,
        username: username as string | undefined,
        email: email as string | undefined,
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
