import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { FollowService } from "../../../src/services/follow.service";

describe("DELETE /follow/:id_follow", () => {
  const server = createServer();
  const endpoint = "/follow";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).delete(
      `${endpoint}/valid-follow-id`
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
      .delete(`${endpoint}/valid-follow-id`)
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  //  __________________ MIDDLEWARE __________________
  // ID FOLLOW AUSENTE
  it("Deve retornar 400 quando não for informado o ID do follow", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .delete(`${endpoint}/`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404); // Rota sem ID gera um erro de "Not Found"
  });

  //  __________________ CONTROLLER __________________
  // SUCESSO NA EXCLUSÃO
  it("Deve retornar 200 quando o follow for deletado com sucesso", async () => {
    const token = makeToken();

    jest.spyOn(FollowService.prototype, "delete").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Follow removido com sucesso!",
    });

    const response = await supertest(server)
      .delete(`${endpoint}/valid-follow-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Follow removido com sucesso!");
  });

  // ERRO NO SERVIDOR
  it("Deve retornar 500 quando ocorrer um erro no servidor", async () => {
    const token = makeToken();

    jest
      .spyOn(FollowService.prototype, "delete")
      .mockRejectedValue(new Error("Erro interno"));

    const response = await supertest(server)
      .delete(`${endpoint}/valid-follow-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      ok: false,
      message: "Erro do servidor: Erro interno",
    });
  });
});
