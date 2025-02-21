import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { ReplyService } from "../../../src/services/reply.service";

import "dotenv/config";

describe("GET /replies/:id_reply", () => {
  const server = createServer();
  const endpoint = "/replies";

  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(`${endpoint}/reply1`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .get(`${endpoint}/reply1`)
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  // ID AUSENTE OU INVÁLIDO
  it("Deve retornar 400 quando o id_reply estiver ausente ou inválido", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .get(`${endpoint}/undefined`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("O id_reply é obrigatório!");
  });

  // REPLY NÃO ENCONTRADO
  it("Deve retornar 404 quando o reply não for encontrado", async () => {
    const token = makeToken();
    const idReply = "replyInexistente";

    jest.spyOn(ReplyService.prototype, "findOneById").mockResolvedValue({
      ok: false,
      code: 404,
      message: "Reply não encontrado.",
    });

    const response = await supertest(server)
      .get(`${endpoint}/${idReply}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Reply não encontrado.");
  });

  // REPLY ENCONTRADO COM SUCESSO
  it("Deve retornar 200 e os dados do reply quando encontrado", async () => {
    const token = makeToken();
    const idReply = "reply1";
    const mockReply = {
      id: "reply1",
      conteudo: "Uma resposta qualquer",
      type: "R",
      idUsuario: "user1",
      idTweet: "tweet1",
    };

    jest.spyOn(ReplyService.prototype, "findOneById").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Reply encontrado com sucesso!",
      data: mockReply,
    });

    const response = await supertest(server)
      .get(`${endpoint}/${idReply}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Reply encontrado com sucesso!");
    expect(response.body.data).toEqual(mockReply);
  });

  // ERRO NO SERVIDOR
  it("Deve retornar 500 se ocorrer um erro interno no servidor", async () => {
    const token = makeToken();
    const idReply = "reply1";

    jest
      .spyOn(ReplyService.prototype, "findOneById")
      .mockRejectedValue(new Error("Erro inesperado"));

    const response = await supertest(server)
      .get(`${endpoint}/${idReply}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Erro do servidor: Erro inesperado");
  });

  it("Deve retornar 500 se ocorrer um erro interno sem message", async () => {
    const token = makeToken();
    const idReply = "reply1";

    jest.spyOn(ReplyService.prototype, "findOneById").mockRejectedValue({});

    const response = await supertest(server)
      .get(`${endpoint}/${idReply}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Erro do servidor: undefined");
  });
});
