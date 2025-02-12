// controllers: É responsável por receber e processar as requisições HTTP e delegam a lógica de negócios a serviços.

import { Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { CreateUsuarioDto } from "../dtos";

export class UsuarioController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      // Pegar os dados do body: parâmetros
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

  public static async findOneById(req: Request, res: Response): Promise<void> {
    try {
      // Pegar os dados do params: id
      const { id_usuario } = req.params;
      const { usuario } = req.body;
      console.log(usuario);

      // 2 - Chamar o serviço
      const service = new UsuarioService();
      const result = await service.findOneById(id_usuario, usuario.id_usuario);

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
      // Pegar os dados do params: id
      const { id_usuario } = req.params;
      // Pegar os dados do body: parâmetros
      const { nome, username } = req.body;

      // 2 - Chamar o serviço
      const service = new UsuarioService();
      const result = await service.update(id_usuario, { nome, username });

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
      // 1 - Pegar os dados do params: id
      const { id_usuario } = req.params;

      // 2 - Chamar o serviço para deletar
      const service = new UsuarioService();
      const result = await service.delete(id_usuario);

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
