import { createServer } from "../../../src/express.server";
import supertest from "supertest";
import { TwitterService } from "../../../src/services/twitter.service";
import { makeToken } from "../make-token";

describe("POST /tweets", () => {
  const server = createServer();
  const endpoint = "/tweets";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).post(endpoint);

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autenticado!",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", "Bearer any_token");

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autenticado!",
    });
  });

  // TOKEN VÁLIDO
  it("Deve retornar 201 quando informado um token válido e dados corretos", async () => {
    const token = makeToken();

    const mockTweet = {
      conteudo: "Meu primeiro tweet",
      type: "T",
      idUsuario: "Id-123",
    };

    const mockService = {
      ok: true,
      code: 201,
      message: "Tweet criado com sucesso!",
      data: mockTweet,
    };

    jest
      .spyOn(TwitterService.prototype, "create")
      .mockResolvedValue(mockService);

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send(mockTweet);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      ok: true,
      message: "Tweet criado com sucesso!",
      data: mockTweet,
    });
  });
  //  __________________ MIDDLEWARE __________________
  // CONTEÚDO AUSENTE
  it("Deve retornar 400 quando não informado um conteúdo no body", async () => {
    const token = makeToken();

    const body = {};

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    // Assets
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Preencha o conteúdo!",
    });
  });

  // ID USUÁRIO AUSENTE
  it("Deve retornar 400 se o Id Usuário não for informado", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Meu primeiro tweet", type: "T" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Preencha o ID do usuário!",
    });
  });

  // TYPE INVÁLIDO
  it("Deve retornar 400 se o type for inválido", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Meu primeiro tweet", idUsuario: "Id-123", type: "M" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Tweet precisa ser do tipo 'T' ou 'R'!",
    });
  });

  //  __________________ CONTROLLER __________________
  // CRIAR TWEET
  it("Deve retornar 201 ao criar um tweet com sucesso", async () => {
    const token = makeToken();

    // Mock da criação do tweet
    const mockTweet = {
      conteudo: "Meu primeiro tweet",
      type: "T",
      idUsuario: "123",
      idTweetPai: null,
    };

    // Mock do serviço para retornar o tweet criado
    jest.spyOn(TwitterService.prototype, "create").mockResolvedValue({
      ok: true,
      code: 201,
      message: "Tweet criado com sucesso!",
      data: mockTweet,
    });

    // Act - Faz a requisição para o Controller
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send(mockTweet); // Removido o ponto e vírgula extra

    // Asserts
    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Tweet criado com sucesso!");
    expect(response.body.data).toEqual(mockTweet);
  });
});
