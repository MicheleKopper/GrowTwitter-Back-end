import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { UsuarioService } from "../../../src/services";
import { UsuarioMock } from "../../services/mocks/usuario.mock";

describe("GET /usuarios", () => {
  const server = createServer();
  const endpoint = "/usuarios";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(endpoint);

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", "Bearer any_token");

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  //  __________________ MIDDLEWARE __________________
  // IDUSUÁRIO INVÁLIDO
  it("Deve retornar 400 quando o IdUsuario não for uma string", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .query({
        idUsuario: 123,
        idTweet: "123",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Id do usuário deve ser uma string válida, não um número",
    });
  });

  //  __________________ CONTROLLER __________________
  // TOKEN E FILTRO VÁLIDO
  it("Deve retornar 200 e uma lista de usuários", async () => {
    const token = makeToken();

    // Mock de 10 tweets
    const usuarios = Array.from({ length: 10 }, () => {
      return UsuarioMock.build();
    });

    jest.spyOn(UsuarioService.prototype, "findAll").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Usuários listados com sucesso!",
      data: usuarios,
    });

    // Act - Faz a requisição para o Controller
    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual({
      ok: true,
      message: "Usuários listados com sucesso!",
      data: expect.arrayContaining([
        expect.objectContaining({
          id_usuario: expect.any(String),
          nome: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
        }),
      ]),
    });
  });
});
