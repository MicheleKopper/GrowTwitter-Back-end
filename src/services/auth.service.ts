import { Usuario } from "@prisma/client";
import { prisma } from "../database/prisma.database";
import { LoginDto } from "../dtos/auth.dto";
import { ResponseApi } from "../types";
import { Bcrypt } from "../utils/bcrypt";
import { randomUUID } from "crypto";

export class AuthService {
  public async login(data: LoginDto): Promise<ResponseApi> {
    try {
      const { email, senha } = data;

      // 1 - Verificar o email
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        return {
          ok: false,
          code: 401,
          message: "Acesso inválido!",
        };
      }

      // 2 - Verificar senha (hash)
      const hash = usuario.senha;
      const bcrypt = new Bcrypt();
      const isValidSenha = await bcrypt.verify(senha, hash);

      if (!isValidSenha) {
        return {
          ok: false,
          code: 401,
          message: "Acesso inválido!",
        };
      }

      // 3 - Gerar o token (ui)
      const token = randomUUID();

      // 4 - Atualizar a coluna authToken
      await prisma.usuario.update({
        where: { id_usuario: usuario.id_usuario },
        data: {
          authToken: token,
        },
      });

      // 5 - Retornar o token
      return {
        ok: true,
        code: 200,
        message: "Login realizado com sucesso!",
        data: { token },
      };
    } catch (error: any) {
      return {
        ok: false,
        code: 500,
        message: "Erro interno do servidor!",
      };
    }
  }

  public async validateToken(token: string): Promise<Usuario | null> {
    const usuario = await prisma.usuario.findFirst({
      where: { authToken: token },
    });

    return usuario;
  }
}
