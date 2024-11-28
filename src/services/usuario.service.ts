import { prisma } from "../database/prisma.database";
import { CreateUsuarioDto } from "../dtos";
import { ResponseApi } from "../types";

export class UsuarioService {
  public async create(createUsuario: CreateUsuarioDto): Promise<ResponseApi> {
    const { nome, username, email, senha } = createUsuario;

    // VALIDAÇÃO DE COLUNA ÚNICA
    const usuario = await prisma.usuario.findUnique({
      where: { email: email },
    });

    if (usuario && usuario.email === email) {
      return {
        ok: false,
        code: 409,
        message: "Este email já está em uso!",
      };
    }

    // CRIAÇÃO NO BANCO DE DADOS
    const usuarioCriado = await prisma.usuario.create({
      data: {
        nome: nome,
        username: username,
        email: email,
        senha: senha,
      },
    });

    return {
      ok: true,
      code: 201,
      message: "Usuário cadastrado com sucesso!",
      data: usuarioCriado,
    };
  }
}
