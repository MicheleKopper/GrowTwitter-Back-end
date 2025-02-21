import { prisma } from "../database/prisma.database";
import { CreateUsuarioDto, QueryFilterDto, UpdateUsuarioDto } from "../dtos";
import { ResponseApi } from "../types";
import { Bcrypt } from "../utils/bcrypt";

export class UsuarioService {
  public async create(createUsuario: CreateUsuarioDto): Promise<ResponseApi> {
    try {
      const { nome, username, email, senha } = createUsuario;

      const usuario = await prisma.usuario.findUnique({ where: { email } });

      if (usuario) {
        return {
          ok: false,
          code: 409,
          message: "Este email já está em uso!",
        };
      }

      const bcrypt = new Bcrypt();
      const senhaHash = await bcrypt.generateHash(senha);

      const usuarioCriado = await prisma.usuario.create({
        data: { nome, username, email, senha: senhaHash },
      });

      return {
        ok: true,
        code: 201,
        message: "Usuário cadastrado com sucesso!",
        data: usuarioCriado,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido.";
      return {
        ok: false,
        code: 500,
        message: `Erro ao criar usuário: ${errorMessage}`,
      };
    }
  }

  public async findAll(query?: QueryFilterDto): Promise<ResponseApi> {
    try {
      const usuarios = await prisma.usuario.findMany({
        where: {
          nome: { contains: query?.nome, mode: "insensitive" },
          username: { contains: query?.username, mode: "insensitive" },
          email: { contains: query?.email, mode: "insensitive" },
        },
      });

      return {
        ok: true,
        code: 200,
        message: "Usuários listados com sucesso!",
        data: usuarios,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido.";
      return {
        ok: false,
        code: 500,
        message: `Erro ao listar usuários: ${errorMessage}`,
      };
    }
  }

  public async findOneById(
    id_usuario: string,
    usuarioLoggedId: string
  ): Promise<ResponseApi> {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario },
        include: { Tweet: true, following: true },
      });

      if (!usuario) {
        return {
          ok: false,
          code: 404,
          message: "Usuário não encontrado!",
        };
      }

      const follow = usuario.following.find(
        (f) => f.followerId === usuarioLoggedId && f.followingId === id_usuario
      );

      return {
        ok: true,
        code: 200,
        message: "Usuário encontrado!",
        data: { ...usuario, isFollowing: !!follow },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido.";
      return {
        ok: false,
        code: 500,
        message: `Erro ao buscar usuário: ${errorMessage}`,
      };
    }
  }

  public async update(
    id_usuario: string,
    updateUsuario: UpdateUsuarioDto
  ): Promise<ResponseApi> {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario },
      });

      if (!usuario) {
        return {
          ok: false,
          code: 404,
          message: "Usuário não encontrado!",
        };
      }

      const usuarioUpdate = await prisma.usuario.update({
        where: { id_usuario },
        data: { ...updateUsuario },
      });

      return {
        ok: true,
        code: 200,
        message: "Usuário atualizado com sucesso!",
        data: usuarioUpdate,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido.";
      return {
        ok: false,
        code: 500,
        message: `Erro ao atualizar usuário: ${errorMessage}`,
      };
    }
  }

  public async delete(id_usuario: string): Promise<ResponseApi> {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario },
      });

      if (!usuario) {
        return {
          ok: false,
          code: 404,
          message: "Usuário não encontrado!",
        };
      }

      await prisma.tweet.deleteMany({ where: { idUsuario: id_usuario } });

      const usuarioDelete = await prisma.usuario.delete({
        where: { id_usuario },
      });

      return {
        ok: true,
        code: 200,
        message: "Usuário deletado com sucesso!",
        data: usuarioDelete,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido.";
      return {
        ok: false,
        code: 500,
        message: `Erro ao deletar usuário: ${errorMessage}`,
      };
    }
  }
}
