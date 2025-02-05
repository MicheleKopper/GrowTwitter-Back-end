import { Usuario } from "@prisma/client";
import { CreateUsuarioDto } from "../../../src/dtos";
import { UsuarioService } from "../../../src/services/usuario.service";
import { prismaMock } from "../../config/prisma.mock";
import { randomUUID } from "crypto";

// Cria um mock de um usuário já existente no banco de dados
const usuarioMock: Usuario = {
  id_usuario: randomUUID(),
  nome: "Michele",
  username: "@michele",
  email: "mi@gmail.com",
  senha: "senha123",
};

describe("Create user service", () => {
  // Função para criar uma instância do serviço que está sendo testado
  const createSut = () => new UsuarioService();

  it("Deve retornar email em uso quando for fornecido um email já utilizado", async () => {
    // Arrange (Configuração do teste)
    const sut = createSut(); // Cria uma instância do serviço

    // Cria um objeto DTO simulando uma tentativa de cadastro com email já usado
    const dto: CreateUsuarioDto = {
      nome: "Michele Kopper",
      username: "@michele",
      email: "michele@gmail.com",
      senha: "senha123",
    };

    // Simula que o banco de dados já tem um usuário com esse email
    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);

    // Act (Execução do código a ser testado)
    const result = await sut.create(dto);

    // Assert (Verificações do teste)
    expect(result.ok).toBe(false);
    expect(result.code).toBe(409);
    expect(result).toHaveProperty("message", "Este email já está em uso!");
  });

  it("deve retornar o usuário criado quando sucesso", async () => {});
});
