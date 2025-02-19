import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { ReplyService } from "../../../src/services/reply.service";

describe("DELETE /replies/:id_reply", () => {
  const server = createServer();
  const endpoint = "/replies";

  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).delete(
      `${endpoint}/valid-reply-id`
    );
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .delete(`${endpoint}/valid-reply-id`)
      .set("Authorization", "Bearer invalid_token");
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  // REPLY NÃO ENCONTRADO
  it("Deve retornar 404 se o reply não for encontrado", async () => {
    const token = makeToken();
    jest.spyOn(ReplyService.prototype, "delete").mockResolvedValue({
      ok: false,
      code: 404,
      message: "Reply não encontrado!",
    });

    const response = await supertest(server)
      .delete(`${endpoint}/invalid-reply-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      ok: false,
      message: "Reply não encontrado!",
    });
  });

  // DELETE SUCESSO
  it("Deve retornar 200 quando a exclusão for bem-sucedida", async () => {
    const token = makeToken();
    const replyDelete = { id_reply: "valid-reply-id" };

    jest.spyOn(ReplyService.prototype, "delete").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Reply deletado com sucesso!",
      data: replyDelete,
    });

    const response = await supertest(server)
      .delete(`${endpoint}/${replyDelete.id_reply}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Reply deletado com sucesso!");
    expect(response.body.data).toEqual(replyDelete);
  });
});
