import { Usuario } from "@prisma/client";
import { randomUUID } from "crypto";

interface UsuarioMockParams {
  nome?: string;
  username?: string;
  email?: string;
  senha?: string;
}

export class usuarioMock {
  // Método para construir um usuário mockado
  public static build(params: UsuarioMockParams): Usuario {
    return {
      id_usuario: randomUUID(),
      nome: "Michele",
      username: "@michele",
      email: "michele@gmail.com",
      senha: "senha123",
    };
  }
}
