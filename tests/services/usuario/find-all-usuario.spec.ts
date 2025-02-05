import { Usuario } from "@prisma/client";
import { QueryFilterDto } from "../../../src/dtos";
import { UsuarioService } from "../../../src/services/usuario.service";
import { prismaMock } from "../../config/prisma.mock";
import { UsuarioMock } from "../mocks/usuario.mock";

// Busca de todos os usuários pelo nome

// Busca de todos os usuários

describe("Find all user", () => {
  const createSut = () => new UsuarioService();

  it("Deve retornar o usuário quando filtrado pelo nome fornecido", async () => {
    // Arrange
    const sut = createSut();
    const queries: QueryFilterDto = {
      nome: "Michele Kopper",
    };

    const usuariosMock = [
      UsuarioMock.build({
        nome: "Michele Kopper",
        username: "@michele",
        email: "michele@gmail.com",
        senha: "senha123",
      }),
    ];

    prismaMock.usuario.findMany.mockResolvedValue(usuariosMock);

    // Act
    const result = await sut.findAll(queries);

    // Asserts
    expect(result.ok).toBeTruthy();
    expect(result.code).toBe(200);
    expect(result.message).toBe("Usuários listados com sucesso!");

    expect(result.data).toHaveLength(1);
    expect(result.data).toEqual([
      {
        id_usuario: expect.any(String),
        nome: "Michele Kopper",
        username: "@michele",
        email: "michele@gmail.com",
        senha: "senha123",
      },
    ]);
  });

  it("Deve retornar todos os usuários", async () => {
    const sut = createSut();
    const usuariosMock = Array.from({ length: 10 }, (_, index) => {
      return UsuarioMock.build({
        username: `username${index}`,
        email: `email${index}@gmail.com`,
      });
    });
    prismaMock.usuario.findMany.mockResolvedValue(usuariosMock);

    // Act
    const result = await sut.findAll();

    // Asserts
    expect(result.ok).toBeTruthy(); // === true
    expect(result.code).toBe(200);
    expect(result.message).toBe("Usuários listados com sucesso!");

    expect(result.data).toHaveLength(10);
    result.data.forEach((usuario: Usuario, index: number) => {
      expect(usuario).toEqual({
        id_usuario: expect.any(String),
        nome: expect.any(String),
        username: `username${index}`,
        email: expect.any(String),
        senha: "senha123",
      });
    });
  });
});
