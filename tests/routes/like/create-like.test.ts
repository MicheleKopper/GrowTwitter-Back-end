import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { LikeService } from "../../../src/services/like.service";

describe("POST /likes", () => {
  const server = createServer();
  const endpoint = "/likes";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).post(endpoint);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  //  __________________ MIDDLEWARE __________________
  // ID USUÁRIO AUSENTE
  it("Deve retornar 400 se o idUsuario não for informado", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ idTweet: "tweet-123" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "idUsuario deve ser uma string!",
    });
  });

  // ID TWEET AUSENTE
  it("Deve retornar 400 se o idTweet não for informado", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: "user-123" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "idTweet deve ser uma string!",
    });
  });

  //  __________________ CONTROLLER __________________
  // SUCESSO NA CRIAÇÃO DO LIKE
  it("Deve retornar 201 ao criar um like com sucesso", async () => {
    const token = makeToken();

    const mockLike = {
      idUsuario: "user-123",
      idTweet: "tweet-123",
    };

    jest.spyOn(LikeService.prototype, "create").mockResolvedValue({
      ok: true,
      code: 201,
      message: "Like registrado com sucesso!",
      data: mockLike,
    });

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send(mockLike);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      ok: true,
      message: "Like registrado com sucesso!",
      data: mockLike,
    });
  });

  // ERRO NO SERVIDOR
  it("Deve retornar 500 quando ocorrer um erro no servidor", async () => {
    const token = makeToken();
    jest
      .spyOn(LikeService.prototype, "create")
      .mockRejectedValue(new Error("Erro interno"));

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: "user-123", idTweet: "tweet-123" });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      ok: false,
      message: "Erro do servidor: Erro interno",
    });
  });

  // ID USUÁRIO NÃO É UMA STRING
  it("Deve retornar 400 se o idUsuario não for uma string", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: 123, idTweet: "tweet-123" }); // idUsuario não é uma string

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "idUsuario deve ser uma string!",
    });
  });

  // ID TWEET NÃO É UMA STRING
  it("Deve retornar 400 se o idTweet não for uma string", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: "user-123", idTweet: 123 }); // idTweet não é uma string

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "idTweet deve ser uma string!",
    });
  });
});
