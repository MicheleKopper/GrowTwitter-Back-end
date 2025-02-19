import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { FollowService } from "../../../src/services/follow.service";

describe("POST /follow", () => {
  const server = createServer();
  const endpoint = "/follow";

  // __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).post(endpoint);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", "Bearer invalid_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Não autorizado! Token inválido ou expirado",
    });
  });

  // __________________ CONTROLLER __________________
  // JÁ ESTÁ SEGUINDO
  it("Deve retornar 409 quando o usuário já estiver seguindo o outro", async () => {
    const token = makeToken();
    const followData = {
      followerId: "user-123",
      followingId: "user-456",
    };

    jest.spyOn(FollowService.prototype, "create").mockResolvedValue({
      ok: false,
      code: 409,
      message: "Você já está seguindo este usuário!",
    });

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send(followData);

    expect(response.statusCode).toBe(409);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Você já está seguindo este usuário!");
  });

  // SUCESSO NA CRIAÇÃO
  it("Deve retornar 201 quando os dados são válidos e o follow for criado", async () => {
    const token = makeToken();
    const followData = {
      followerId: "user-123",
      followingId: "user-456",
    };

    jest.spyOn(FollowService.prototype, "create").mockResolvedValue({
      ok: true,
      code: 201,
      message: "Agora você está seguindo este usuário!",
      data: followData,
    });

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send(followData);

    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe(
      "Agora você está seguindo este usuário!"
    );
    expect(response.body.data).toEqual(followData);
  });

  //  __________________ MIDDLEWARE __________________
  it("Deve retornar 400 quando o ID do seguidor não for informado", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ followingId: "valid-user-id" }); // Sem followerId

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      code: 400,
      message: "Preencha os IDs do seguidor e seguido!",
    });
  });

  it("Deve retornar 400 quando o ID do seguido não for informado", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ followerId: "valid-user-id" }); // Sem followingId

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      code: 400,
      message: "Preencha os IDs do seguidor e seguido!",
    });
  });

  it("Deve retornar 400 quando o usuário tentar seguir a si mesmo", async () => {
    const token = makeToken();
    const userId = "valid-user-id";

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ followerId: userId, followingId: userId }); // Mesmo ID para ambos

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      code: 400,
      message: "Você não pode seguir a si mesmo!",
    });
  });
});
