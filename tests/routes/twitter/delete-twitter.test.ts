import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { TwitterService } from "../../../src/services/twitter.service";

describe("DELETE /tweets/:id_tweet", () => {
  const server = createServer();
  const endpoint = "/tweets";

  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).delete(`${endpoint}/tweet1`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .delete(`${endpoint}/tweet1`)
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  // TWEET NÃO ENCONTRADO
  it("Deve retornar 404 quando o tweet não for encontrado", async () => {
    const token = makeToken();
    const idTweet = "tweetInexistente";

    jest.spyOn(TwitterService.prototype, "delete").mockResolvedValue({
      ok: false,
      code: 404,
      message: "Tweet não encontrado!",
    });

    const response = await supertest(server)
      .delete(`${endpoint}/${idTweet}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Tweet não encontrado!");
  });

  // TWEET DELETADO COM SUCESSO
  it("Deve retornar 200 e confirmar a exclusão do tweet", async () => {
    const token = makeToken();
    const idTweet = "tweet1";
    const mockTweet = {
      id: "tweet1",
      conteudo: "Um tweet qualquer",
      idUsuario: "user1",
      createdAt: "2025-02-19T12:00:00Z",
    };

    jest.spyOn(TwitterService.prototype, "delete").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Tweet deletado com sucesso!",
      data: mockTweet,
    });

    const response = await supertest(server)
      .delete(`${endpoint}/${idTweet}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Tweet deletado com sucesso!");
    expect(response.body.data).toEqual(mockTweet);
  });

  // ERRO NO SERVIDOR
  it("Deve retornar 500 se ocorrer um erro interno no servidor", async () => {
    const token = makeToken();
    const idTweet = "tweet1";

    jest
      .spyOn(TwitterService.prototype, "delete")
      .mockRejectedValue(new Error("Erro inesperado"));

    const response = await supertest(server)
      .delete(`${endpoint}/${idTweet}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Erro do servidor: Erro inesperado");
  });
});
