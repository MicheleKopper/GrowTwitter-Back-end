import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { ReplyService } from "../../../src/services/reply.service";
import { makeToken } from "../make-token";

describe("put /replies/:id_reply", () => {
  const server = createServer();
  const endpoint = "/replies";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).put(`${endpoint}/valid-reply-id`);

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .put("/replies/valid-reply-id")
      .set("Authorization", "Bearer any_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  // TOKEN VÁLIDO
  it("Deve retornar 200 quando informado o token", async () => {
    const token = makeToken();
    const reply = {
      id_reply: "valid-reply-id",
      conteudo: "Novo conteúdo",
    };

    jest.spyOn(ReplyService.prototype, "update").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Resposta atualizada com sucesso!",
      data: reply,
    });

    const response = await supertest(server)
      .put(`/replies/${reply.id_reply}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Novo conteúdo" });

    expect(response.statusCode).toBe(200);
  });

  //  __________________ MIDDLEWARE __________________
  // CONTEÚDO AUSENTE
  it("Deve retornar 400 se o conteúdo estiver ausente", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .put(`${endpoint}/valid-reply-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Conteúdo é obrigatório!",
    });
  });

  // CONTEÚDO INVÁLIDO
  it("Deve retornar 400 se o conteúdo não for uma string", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .put(`${endpoint}/valid-reply-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: 123 });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Conteúdo inválido!",
    });
  });

  // UPDATE SUCESSO
  it("Deve retornar 200 quando os dados são válidos", async () => {
    const token = makeToken();
    const replyUpdate = {
      id_reply: "valid-reply-id",
      conteudo: "Meu reply atualizado",
    };

    jest.spyOn(ReplyService.prototype, "update").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Resposta atualizada com sucesso!",
      data: replyUpdate,
    });

    const response = await supertest(server)
      .put(`${endpoint}/${replyUpdate.id_reply}`)
      .set("Authorization", `Bearer ${token}`)
      .send(replyUpdate);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Resposta atualizada com sucesso!");
    expect(response.body.data).toEqual(replyUpdate);
  });

  it("Deve retornar 404 quando o reply não for encontrado", async () => {
    const token = makeToken();
    const idReplyInexistente = "reply-nao-existe";

    jest.spyOn(ReplyService.prototype, "update").mockResolvedValue({
      ok: false,
      code: 404,
      message: "Reply não encontrado.",
    });

    const response = await supertest(server)
      .put(`${endpoint}/${idReplyInexistente}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Novo conteúdo" });

    expect(response.statusCode).toBe(404);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Reply não encontrado.");
  });

  it("Deve retornar 500 se ocorrer um erro interno no serviço", async () => {
    const token = makeToken();
    const idReply = "valid-reply-id";

    jest
      .spyOn(ReplyService.prototype, "update")
      .mockRejectedValue(new Error("Erro inesperado no banco"));

    const response = await supertest(server)
      .put(`${endpoint}/${idReply}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ conteudo: "Texto válido" });

    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe(
      "Erro do servidor: Erro inesperado no banco"
    );
  });
});
