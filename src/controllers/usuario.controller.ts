// controllers: É responsável por receber e processar as requisições HTTP e delegam a lógica de negócios a serviços.

import { Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";
import { CreateUsuarioDto } from "../dtos";

export class UsuarioController {
  public static async create(req: Request, res: Response): Promise<void> {
    const { nome, username, email, senha } = req.body;
    // Chamar o serviço responsável

    const data: CreateUsuarioDto = {
      nome: nome,
      username: username,
      email: email,
      senha: senha,
    };

    const service = new UsuarioService();
    const result = await service.create(data);

    // Retornar para o cliente as infos que o serviço retornar
    const { code, ...response } = result;
    res.status(code).json(response);
  }
}
