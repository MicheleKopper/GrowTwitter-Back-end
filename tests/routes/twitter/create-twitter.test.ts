// // POST - CRIAR UM NOVO TWEET OU REPLY
// router.post(
//   "/tweets",
//   [
//     AuthMiddleware.validate, // Valida se o usuário está autenticado
//     CreateTwitterMiddleware.validateRequired, // Valida campos obrigatórios
//     CreateTwitterMiddleware.validateTypes, // Valida tipos dos dados
//   ],
//   TwitterController.create
// );
import { createServer } from "../../../src/express.server";
import supertest from "supertest";
import { TwitterService } from "../../../src/services/twitter.service";
import { makeToken } from "../make-token";
import { data } from "react-router-dom";

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

  
});
