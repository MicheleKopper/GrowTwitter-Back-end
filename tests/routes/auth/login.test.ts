import { createServer } from "../../../src/express.server";
import supertest from "supertest";
import { AuthService } from "../../../src/services";
import { prismaMock } from "../../../tests/config/prisma.mock";
import { UsuarioMock } from "../../services/mocks/usuario.mock";
import { Bcrypt } from "../../../src/utils/bcrypt";

// Verificar as propriedades obrigatórias enviadas no body (required)
// Verificar os tipos das propriedades enviadas no body (types)
// Verificar o login feito com sucesso

describe("POST /login", () => {
  // Sut
  const server = createServer();
  const endpoint = "/login";

  it("Deve retornar 400 quando não informado um email no body", async () => {
    // Arrange
    const body = {};

    // Act
    const response = await supertest(server).post(endpoint).send(body);

    // Assets
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Email obrigatório!",
    });
  });

  it("Deve retornar 400 quando não informado uma senha no body", async () => {
    // Arrange
    const body = { email: "michele@email.com" };

    // Act
    const response = await supertest(server).post(endpoint).send(body);

    // Assets
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Senha obrigatória!",
    });
  });

  it("Deve retornar BadRequest quando não informado um email do tipo string", async () => {
    // Arrange
    const body = { email: 1, senha: "senha123" };

    // Act
    const response = await supertest(server).post(endpoint).send(body);

    // Asserts
    expect(response).toHaveProperty("statusCode", 400);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toBe("Email deve ser uma string!");
  });

  it("Deve retornar BadRequest quando não informado uma senha do tipo string", async () => {
    // Arrange
    const body = { email: "email@email.com", senha: 12345 };

    // Act
    const response = await supertest(server).post(endpoint).send(body);

    // Asserts
    expect(response).toHaveProperty("statusCode", 400);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toBe("Senha deve ser uma string!");
  });

  // Ex mockando o Service
  it("Deve retornar 200 quando fornecido um body válido - Mock service", async () => {
    // Arrange
    const body = { email: "email@email.com", senha: "senha123" };

    // Mock do service
    const mockAuth = {
      ok: true,
      code: 200,
      message: "Login realizado com sucesso!",
      data: { usuario: {}, token: "any_token" },
    };

    // Espião
    jest.spyOn(AuthService.prototype, "login").mockResolvedValue(mockAuth);

    // Act
    const response = await supertest(server).post(endpoint).send(body);

    console.log(response.body);

    // Assets
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ok: true,

      message: "Login realizado com sucesso!",
      data: { usuario: expect.any(Object), token: expect.any(String) },
    });
  });

  // Ex mockando o Prisma
  it("Deve retornar 200 quando fornecido um body válido - Mock do Prisma e Bcrypt", async () => {
    // Arrange
    const body = { email: "email@email.com", senha: "senha123" };

    // Mock do Prisma
    prismaMock.usuario.findUnique.mockResolvedValue(UsuarioMock.build());

    // Mock do vcrypt.verify
    jest.spyOn(Bcrypt.prototype, "verify").mockResolvedValue(true);

    // Act
    const response = await supertest(server).post(endpoint).send(body);

    console.log(response.body);

    // Assets
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ok: true,

      message: "Login realizado com sucesso!",
      data: { usuario: expect.any(Object), token: expect.any(String) },
    });
  });

  it("Deve retornar 500 quando houver uma exceção - erro", async () => {
    // Arrege
    const body = { email: "email@email.com", senha: "senha123" };

    jest
      .spyOn(AuthService.prototype, "login")
      .mockRejectedValue(new Error("Exceção"));

    // Act
    const response = await supertest(server).post(endpoint).send(body);

    // Asserts
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      ok: false,
      message: "Erro do servidor: Exceção",
    });
  });
});
