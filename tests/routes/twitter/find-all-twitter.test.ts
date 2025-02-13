import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { TwitterService } from "../../../src/services/twitter.service";
import { TwitterMock } from "../../services/mocks/twitter.mock";
import "dotenv/config";

describe("GET /tweets", () => {
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
      .get(endpoint)
      .set("Authorization", "Bearer any_token");

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autenticado!",
    });
  });

  // TOKEN VÁLIDO
  it("Deve retornar 200 quando informado o token", async () => {
    const token = makeToken();

    const mockService = {
      ok: true,
      code: 200,
      message: "Tweets listados com sucesso!",
      data: [],
    };

    jest
      .spyOn(TwitterService.prototype, "findAll")
      .mockResolvedValue(mockService);

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response).toHaveProperty("statusCode", 200);
  });

  //  __________________ MIDDLEWARE __________________
  // TYPE INVÁLIDO
  it("Deve retornar 400 quando o type for inválido", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .query({ conteudo: "Conteúdo", type: "Type inválido" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "O tipo deve ser 'Tweet' ou 'Reply'",
    });
  });

  //  __________________ CONTROLLER __________________
  // FILTRO VÁLIDO
  it("Deve retornar 200 e uma lista de tweets", async () => {
    const token = makeToken();

    // Mock de 10 tweets
    const mockTweets = Array.from({ length: 10 }, () => {
      return TwitterMock.build(); // Cria o tweet mockado
    });

    // Mockar o serviço para retornar esses tweets
    jest.spyOn(TwitterService.prototype, "findAll").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Tweets listados com sucesso!",
      data: mockTweets,
    });

    // Act - Faz a requisição para o Controller
    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    // Asserts
    expect(response.body.data).toHaveLength(10); // Verifica se retornou 10 tweets

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Tweets listados com sucesso!");

    // Verifica se o conteúdo dos tweets corresponde ao mock
    expect(response.body.data).toEqual(mockTweets);
  });
});
