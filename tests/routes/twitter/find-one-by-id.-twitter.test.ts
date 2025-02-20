import { createServer } from "../../../src/express.server";
import supertest from "supertest";
import { makeToken } from "../make-token";
import { TwitterService } from "../../../src/services/twitter.service";
import { TwitterMock } from "../../services/mocks/twitter.mock";


describe("GET /tweets/:id_tweet", () => {
  const server = createServer();
  const endpoint = "/tweets";

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

  // TOKEN VÁLIDO
  it("Deve retornar 200 quando informado o token", async () => {
    const token = makeToken();

    // Criar um tweet com ID válido
    const tweet = TwitterMock.build({ id_tweet: "valid-tweet-id" });

    // Mock do serviço
    const mockService = {
      ok: true,
      code: 200,
      message: "Tweet encontrado!",
      data: [tweet],
    };

    const spy = jest
      .spyOn(TwitterService.prototype, "findOneById")
      .mockResolvedValue(mockService);

    const response = await supertest(server)
      .get(`/tweets/${tweet.id_tweet}`)
      .set("Authorization", `Bearer ${token}`);

    expect(spy).toHaveBeenCalledTimes(1); // Agora a chamada deve ser reconhecida
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      ok: true,
      message: "Tweet encontrado!",
    });
  });

  //  __________________ CONTROLLER __________________
  // FILTRO VÁLIDO
  it("Deve retornar 200 e os dados do tweet quando informado um ID válido", async () => {
    const token = makeToken();

    const tweet = TwitterMock.build({ id_tweet: "valid-tweet-id" });

    // Mockar o serviço para retornar um tweet
    const mockService = {
      ok: true,
      code: 200,
      message: "Tweet encontrado!",
      data: tweet,
    };

    // Espionar o serviço e mockar o retorno
    jest
      .spyOn(TwitterService.prototype, "findOneById")
      .mockResolvedValue(mockService);

    // Act - Faz a requisição para o Controller
    const response = await supertest(server)
      .get(`/tweets/${tweet.id_tweet}`)
      .set("Authorization", `Bearer ${token}`)
      .send(mockService);

    // Asserts
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Tweet encontrado!");
    expect(response.body.data).toEqual(tweet);
  });

  // FILTRO INVÁLIDO
  it("Deve retornar 404 e mensagem de erro quando o tweet não for encontrado", async () => {
    const token = makeToken();

    // Mockar o serviço
    const mockService = {
      ok: false,
      code: 404,
      message: "Tweet não encontrado!",
      data: null,
    };

    // Espionar o serviço e mockar o retorno
    jest
      .spyOn(TwitterService.prototype, "findOneById")
      .mockResolvedValue(mockService);

    const invalidTweetId = "invalid-tweet-id";

    // Act - Faz a requisição para o Controller
    const response = await supertest(server)
      .get(`/tweets/${invalidTweetId}`)
      .set("Authorization", `Bearer ${token}`);

    // Asserts
    expect(response.statusCode).toBe(404);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Tweet não encontrado!");
    expect(response.body.data).toBeNull();
  });
});
