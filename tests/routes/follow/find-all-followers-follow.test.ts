import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { FollowService } from "../../../src/services/follow.service";

describe("GET /follow/:id_usuario", () => {
  const server = createServer();
  const endpoint = "/follow";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(`${endpoint}/valid-user-id`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .get(`${endpoint}/valid-user-id`)
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  //  __________________ CONTROLLER __________________
  // SUCESSO NA BUSCA
  it("Deve retornar 200 quando os seguidores forem encontrados", async () => {
    const token = makeToken();
    const followersMock = [
      { id: "1", nome: "Usuário 1" },
      { id: "2", nome: "Usuário 2" },
    ];

    jest.spyOn(FollowService.prototype, "findAllFollowers").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Seguidores encontrados!",
      data: followersMock,
    });

    const response = await supertest(server)
      .get(`${endpoint}/valid-user-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Seguidores encontrados!");
    expect(response.body.data).toEqual(followersMock);
  });

  // ERRO NO SERVIDOR
  it("Deve retornar 500 quando ocorrer um erro no servidor", async () => {
    const token = makeToken();
    jest
      .spyOn(FollowService.prototype, "findAllFollowers")
      .mockRejectedValue(new Error("Erro interno"));

    const response = await supertest(server)
      .get(`${endpoint}/valid-user-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      ok: false,
      message: "Erro do servidor: Erro interno",
    });
  });
});
