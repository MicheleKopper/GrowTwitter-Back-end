import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { LikeService } from "../../../src/services/like.service";
import "dotenv/config";

describe("PUT /likes/:id_like", () => {
  const server = createServer();
  const endpoint = "/likes";

  //  __________________ AUTH __________________
  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).put(`${endpoint}/valid-like-id`);

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autorizado! Token obrigatório",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .put(`${endpoint}/valid-like-id`)
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

    // Criar um like válido
    const like = {
      id_like: "valid-like-id",
      idUsuario: "123e4567-e89b-12d3-a456-426614174000",
      idTweet: "789e4567-e89b-12d3-a456-426614174999",
    };

    // Mock do serviço `update`
    jest.spyOn(LikeService.prototype, "update").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Like atualizado com sucesso!",
      data: like,
    });

    const response = await supertest(server)
      .put(`${endpoint}/${like.id_like}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ idTweet: "novo-tweet-id" });

    expect(response.statusCode).toBe(200);
  });

  //  __________________ MIDDLEWARE __________________
  // NENHUM DADO ENVIADO
  it("Deve retornar 400 se nenhum campo for enviado", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .put(`${endpoint}/valid-like-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Ao menos um campo (idUsuario ou idTweet) deve ser fornecido!",
    });
  });

  // TIPO INVÁLIDO PARA ID_USUARIO
  it("Deve retornar 400 se idUsuario for inválido", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .put(`${endpoint}/valid-like-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: 123 });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Id Usuário precisa ser uma string!",
    });
  });

  // UPDATE SUCESSO
  it("Deve retornar 200 quando os dados são válidos", async () => {
    const token = makeToken();

    const likeUpdate = {
      id_like: "valid-like-id",
      idUsuario: "123e4567-e89b-12d3-a456-426614174000",
      idTweet: "novo-tweet-id",
    };

    // Mock do serviço `update`
    jest.spyOn(LikeService.prototype, "update").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Like atualizado com sucesso!",
      data: likeUpdate,
    });

    const response = await supertest(server)
      .put(`${endpoint}/valid-like-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ idTweet: "novo-tweet-id" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      message: "Like atualizado com sucesso!",
      data: likeUpdate,
    });
  });

  //  __________________ CONTROLLER __________________
  it("Deve retornar 200 e o like atualizado", async () => {
    const token = makeToken();

    const likeUpdate = {
      id_like: "valid-like-id",
      idUsuario: "123e4567-e89b-12d3-a456-426614174000",
      idTweet: "novo-tweet-id",
    };

    // Mock do serviço para retornar o like atualizado
    jest.spyOn(LikeService.prototype, "update").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Like atualizado com sucesso!",
      data: likeUpdate,
    });

    // Act - Faz a requisição para o Controller
    const response = await supertest(server)
      .put(`${endpoint}/valid-like-id`)
      .set("Authorization", `Bearer ${token}`)
      .send(likeUpdate);

    // Asserts
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Like atualizado com sucesso!");
    expect(response.body.data).toEqual(likeUpdate);
  });
});
