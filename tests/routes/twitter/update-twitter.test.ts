import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { TwitterService } from "../../../src/services/twitter.service";
import "dotenv/config";

describe("PUT /tweets/:id_tweet", () => {
  const server = createServer();
  const endpoint = "/tweets";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(endpoint);

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autenticado!",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .put("/tweets/valid-tweet-id")
      .set("Authorization", "Bearer any_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      ok: false,
      message: "Não autenticado!",
    });
  });

  // TOKEN VÁLIDO
  it("Deve retornar 200 quando informado o token", async () => {
    const token = makeToken();

    // Criar um tweet válido
    const tweet = {
      id_tweet: "valid-tweet-id",
      conteudo: "Novo conteúdo",
      type: "T",
    };

    // Mock do serviço `update`
    jest.spyOn(TwitterService.prototype, "update").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Tweet atualizado com sucesso!",
      data: tweet,
    });

    const response = await supertest(server)
      .put(`/tweets/${tweet.id_tweet}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Novo conteúdo", type: "T" });

    expect(response.statusCode).toBe(200);
  });

  //  __________________ MIDDLEWARE __________________
  // CONTEÚDO AUSENTE
  it("Deve retornar 400 se o conteúdo estiver ausente", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .put(`${endpoint}/valid-tweet-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "T" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Conteúdo é obrigatório!",
    });
  });

  // TYPE INVÁLIDO
  it("Deve retornar 400 se o type for inválido", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .put(`${endpoint}/valid-tweet-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Conteúdo", type: "X" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Tweet precisa ser do tipo 'T' ou 'R'!",
    });
  });

  // IDTWEETPAI INVÁLIDO
  it("Deve retornar 400 se 'type' for 'R' e 'idTweetPai' for inválido", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .put(`${endpoint}/valid-tweet-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Novo conteúdo", type: "R" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "idTweetPai deve ser uma string válida!",
    });
  });

  // UPDATE SUCESSO
  it("Deve retornar 200 quando os dados são válidos", async () => {
    const token = makeToken();

    // Criando o mesmo objeto que o Prisma retornaria no TwitterService
    const twitterUpdate = {
      id_tweet: "valid-tweet-id",
      conteudo: "Novo conteúdo",
      type: "T",
      idTweetPai: null,
    };

    // Mock do serviço `update`
    jest.spyOn(TwitterService.prototype, "update").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Tweet atualizado com sucesso!",
      data: twitterUpdate,
    });

    const response = await supertest(server)
      .put(`${endpoint}/valid-tweet-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Novo conteúdo", type: "T" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      message: "Tweet atualizado com sucesso!",
      data: twitterUpdate,
    });
  });

  //  __________________ CONTROLLER __________________
  it.only("Deve retornar 200 e o tweeter atualizado", async () => {
    const token = makeToken();

    const twitterUpdate = {
      conteudo: "Meu tweet atualizado",
      type: "T",
      id_tweet: "123",
      idTweetPai: null,
    };

    // Mock do serviço para retornar o tweet criado
    jest.spyOn(TwitterService.prototype, "update").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Tweet atualizado com sucesso!",
      data: twitterUpdate,
    });

    // Act - Faz a requisição para o Controller
    const response = await supertest(server)
      .put(`${endpoint}/valid-tweet-id`)
      .set("Authorization", `Bearer ${token}`)
      .send(twitterUpdate);

    // Asserts
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Tweet atualizado com sucesso!");
    expect(response.body.data).toEqual(twitterUpdate);
  });
});
