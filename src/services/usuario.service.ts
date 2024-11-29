import { prisma } from "../database/prisma.database";
import { CreateUsuarioDto, QueryFilterDto, UpdateUsuarioDto } from "../dtos";
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

  public async findAll(query: QueryFilterDto): Promise<ResponseApi> {
    const usuarios = await prisma.usuario.findMany({
      where: {
        nome: { contains: query.nome, mode: "insensitive" },
        username: { contains: query.username, mode: "insensitive" },
        email: { contains: query.email, mode: "insensitive" },
      },
    });

    return {
      ok: true,
      code: 200,
      message: "Usuários listados com sucesso!",
      data: usuarios,
    };
  }

  public async findOneById(id_usuario: string): Promise<ResponseApi> {
    // 1 - Buscar
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario },
      include: { tweet: true },
    });

    // 2 - Validar se existir
    if (!usuario) {
      return {
        ok: false,
        code: 404,
        message: "Usuário não encontrado!",
      };
    }
    // 3 - Retornar o dado
    return {
      ok: true,
      code: 200,
      message: "Usuário encontrado!",
      data: usuario,
    };
  }

  public async update(
    id_usuario: string,
    updateUsuario: UpdateUsuarioDto
  ): Promise<ResponseApi> {
    // 1 - Verificar se o id existe
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario },
    });

    if (!usuario) {
      return {
        ok: false,
        code: 404,
        message: "Usuario não encontrado!",
      };
    }

    // 2 - Atualizar (prisma)
    const usuarioUpdate = await prisma.usuario.update({
      where: { id_usuario },
      data: { ...updateUsuario }, // Espalha as propriedades
    });

    // 3 - Retornar os dados
    return {
      ok: true,
      code: 200,
      message: "Usuário atualizado com sucesso!",
      data: usuarioUpdate,
    };
  }

  public async delete(id_usuario: string): Promise<ResponseApi> {
    // 1 - Verificar se o id existe
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario },
    });

    if (!usuario) {
      return {
        ok: false,
        code: 404,
        message: "Usuario não encontrado!",
      };
    }

    await prisma.tweet.deleteMany({
      where: { idUsuario: id_usuario },
    });

    // 2 - Deletar o usuário
    const usuarioDelete = await prisma.usuario.delete({
      where: { id_usuario },
    });

    // 3 - Retornar os dados
    return {
      ok: true,
      code: 200,
      message: "Usuário deletado com sucesso!",
      data: usuarioDelete,
    };
  }
}
