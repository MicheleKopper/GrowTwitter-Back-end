import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { LikeService } from "../../../src/services/like.service";
import "dotenv/config";

describe("GET /likes/:id_usuario", () => {
  const server = createServer();
  const endpoint = "/likes";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(`${endpoint}/some-id`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .get(`${endpoint}/some-id`)
      .set("Authorization", "Bearer any_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  //  __________________ MIDDLEWARE __________________
  // ID USUÁRIO INVÁLIDO (não é UUID)
  it("Deve retornar 400 se o id_usuario não for um UUID válido", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .get(`${endpoint}/invalid-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Identificador precisa ser um Uuid!",
    });
  });

  //  __________________ CONTROLLER __________________
  // ID VÁLIDO - USUÁRIO SEM LIKES
  it("Deve retornar 200 e um array vazio quando o usuário não tiver likes", async () => {
    const token = makeToken();
    const validUserId = "550e8400-e29b-41d4-a716-446655440000";

    // Mockando manualmente o retorno do serviço
    jest.spyOn(LikeService.prototype, "findOneById").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Nenhum like encontrado!",
      data: [],
    });

    const response = await supertest(server)
      .get(`${endpoint}/${validUserId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  // ID VÁLIDO - USUÁRIO COM LIKES
  it("Deve retornar 200 e a lista de likes quando o id_usuario for válido", async () => {
    const token = makeToken();
    const validUserId = "550e8400-e29b-41d4-a716-446655440000";

    const mockLikes = [
      { id_like: "like-123", id_tweet: "tweet-123", id_usuario: validUserId },
      { id_like: "like-456", id_tweet: "tweet-456", id_usuario: validUserId },
    ];

    jest.spyOn(LikeService.prototype, "findOneById").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Likes encontrados!",
      data: mockLikes,
    });

    const response = await supertest(server)
      .get(`${endpoint}/${validUserId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data).toEqual(mockLikes);
  });

  // ERRO INTERNO NO SERVIDOR
  it("Deve retornar 500 se ocorrer um erro interno no servidor", async () => {
    const token = makeToken();
    const validUserId = "550e8400-e29b-41d4-a716-446655440000";

    jest
      .spyOn(LikeService.prototype, "findOneById")
      .mockRejectedValue(new Error("Erro interno"));

    const response = await supertest(server)
      .get(`${endpoint}/${validUserId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      ok: false,
      message: "Erro do servidor: Erro interno", // Ajustado para corresponder à resposta real
    });
  });
});
