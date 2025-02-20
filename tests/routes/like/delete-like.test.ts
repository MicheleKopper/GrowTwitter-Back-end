import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { LikeService } from "../../../src/services/like.service";
import "dotenv/config";

describe("DELETE /likes/:id_like", () => {
  const server = createServer();
  const endpoint = "/likes";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).delete(`${endpoint}/like-id`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .delete(`${endpoint}/like-id`)
      .set("Authorization", "Bearer any_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  //  __________________ CONTROLLER __________________
  // LIKE NÃO ENCONTRADO
  it("Deve retornar 404 quando o like não for encontrado", async () => {
    const token = makeToken();
    const likeId = "550e8400-e29b-41d4-a716-446655440000";

    jest
      .spyOn(LikeService.prototype, "delete")
      .mockResolvedValue({
        ok: false,
        code: 404,
        message: "Like não encontrado!",
      });

    const response = await supertest(server)
      .delete(`${endpoint}/${likeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      ok: false,
      message: "Like não encontrado!",
    });
  });

  // DELETE COM SUCESSO
  it("Deve retornar 200 quando o like for deletado com sucesso", async () => {
    const token = makeToken();
    const likeId = "550e8400-e29b-41d4-a716-446655440000";

    jest
      .spyOn(LikeService.prototype, "delete")
      .mockResolvedValue({
        ok: true,
        code: 200,
        message: "Like removido com sucesso!",
      });

    const response = await supertest(server)
      .delete(`${endpoint}/${likeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      message: "Like removido com sucesso!",
    });
  });

  // ERRO INTERNO NO SERVIDOR
  it("Deve retornar 500 se ocorrer um erro interno no servidor", async () => {
    const token = makeToken();
    const likeId = "550e8400-e29b-41d4-a716-446655440000";

    jest
      .spyOn(LikeService.prototype, "delete")
      .mockRejectedValue(new Error("Erro interno"));

    const response = await supertest(server)
      .delete(`${endpoint}/${likeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      ok: false,
      message: "Erro do servidor: Erro interno",
    });
  });
});
