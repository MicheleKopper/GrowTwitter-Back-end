import supertest from "supertest";
import { makeToken } from "../make-token";
import { ReplyService } from "../../../src/services/reply.service";
import { TwitterMock } from "../../services/mocks/twitter.mock";
import { createServer } from "../../../src/express.server";

describe("GET /replies", () => {
  const server = createServer();
  const token = makeToken();
  const endpoint = "/replies";

  it("Deve retornar 200 e uma lista de respostas", async () => {
    const mockReplies = [
      TwitterMock.build({ id_tweet: "reply-1", conteudo: "Primeira resposta" }),
      TwitterMock.build({ id_tweet: "reply-2", conteudo: "Segunda resposta" }),
    ];

    // Mockando o serviço para retornar os replies
    jest.spyOn(ReplyService.prototype, "findAll").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Replies listados com sucesso!",
      data: mockReplies,
    });

    // Fazendo a requisição
    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    // Asserts
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Replies listados com sucesso!");
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data).toEqual(mockReplies);
  });

  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(endpoint);

    expect(response.statusCode).toBe(401);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Não autorizado! Token obrigatório");
  });

  it("Deve retornar 200 e uma lista vazia quando não houver replies", async () => {
    jest.spyOn(ReplyService.prototype, "findAll").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Nenhuma resposta encontrada!",
      data: [],
    });

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Nenhuma resposta encontrada!");
    expect(response.body.data).toEqual([]);
  });
});
