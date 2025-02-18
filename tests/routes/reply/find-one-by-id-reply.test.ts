import supertest from "supertest";
import { makeToken } from "../make-token";
import { ReplyService } from "../../../src/services/reply.service";
import { createServer } from "../../../src/express.server";
import { TwitterMock } from "../../services/mocks/twitter.mock";

describe("GET /replies/:id_reply", () => {
  const server = createServer();
  const token = makeToken();
  const endpoint = "/replies";

  it("Deve retornar 200 e o reply quando o ID for válido", async () => {
    const mockReply = TwitterMock.build({
      id_reply: "reply-1",
      conteudo: "Resposta de teste",
    });

    // Mockando o serviço para retornar um reply
    jest.spyOn(ReplyService.prototype, "findOneById").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Reply encontrado com sucesso!",
      data: mockReply,
    });

    const response = await supertest(server)
      .get(`${endpoint}/reply-1`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Reply encontrado com sucesso!");
    expect(response.body.data).toEqual(mockReply);
  });

  it("Deve retornar 404 quando o reply não for encontrado", async () => {
    jest.spyOn(ReplyService.prototype, "findOneById").mockResolvedValue({
      ok: false,
      code: 404,
      message: "Reply não encontrado.",
    });

    const response = await supertest(server)
      .get(`${endpoint}/reply-inexistente`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Reply não encontrado.");
  });

  it("Deve retornar 500 quando houver erro no servidor", async () => {
    jest
      .spyOn(ReplyService.prototype, "findOneById")
      .mockRejectedValue(new Error("Erro ao buscar reply"));

    const response = await supertest(server)
      .get(`${endpoint}/reply-1`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe(
      "Erro do servidor: Erro ao buscar reply"
    );
  });
});
