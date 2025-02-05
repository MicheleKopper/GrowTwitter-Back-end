import { Usuario } from "@prisma/client";
import { randomUUID } from "crypto";

interface UsuarioMockParams {
  nome?: string;
  username?: string;
  email?: string;
  senha?: string;
}

// Usuário mockado com parâmetros opcionais
export class UsuarioMock {
  public static build(params?: UsuarioMockParams): Usuario {
    return {
      id_usuario: randomUUID(),
      nome: params?.nome || "Michele",
      username: params?.username || "@michele",
      email: params?.email || "michele@gmail.com",
      senha: params?.senha || "senha123",
    };
  }
}
