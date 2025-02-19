import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { ReplyService } from "../../../src/services/reply.service";


describe("GET /replies", () => {
  const server = createServer();
  const endpoint = "/replies";

  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(endpoint);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  // SUCESSO - RETORNANDO TODAS AS REPLIES
  it("Deve retornar 200 e uma lista de replies quando não for passado id_reply", async () => {
    const token = makeToken();
    const mockReplies = [
      {
        id: "reply1",
        conteudo: "Primeira resposta",
        type: "R",
        idUsuario: "user1",
        idTweet: "tweet1",
      },
      {
        id: "reply2",
        conteudo: "Segunda resposta",
        type: "R",
        idUsuario: "user2",
        idTweet: "tweet2",
      },
    ];

    jest.spyOn(ReplyService.prototype, "findAll").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Replies listados com sucesso!",
      data: mockReplies,
    });

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Replies listados com sucesso!");
    expect(response.body.data).toEqual(mockReplies);
  });


  // ERRO NO SERVIDOR
  it("Deve retornar 500 se ocorrer um erro interno no servidor", async () => {
    const token = makeToken();

    jest
      .spyOn(ReplyService.prototype, "findAll")
      .mockRejectedValue(new Error("Erro inesperado"));

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Erro do servidor: Erro inesperado");
  });
});
