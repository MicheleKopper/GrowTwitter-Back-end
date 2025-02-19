import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { ReplyService } from "../../../src/services/reply.service";

describe("POST /replies", () => {
  const server = createServer();
  const endpoint = "/replies";

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

  // CONTEÚDO AUSENTE
  it("Deve retornar 400 se o conteúdo estiver ausente", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "R",
        idUsuario: "valid-user-id",
        idTweet: "valid-tweet-id",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Preencha o conteúdo!",
    });
  });

  // TIPO DE DADO INVÁLIDO
  it("Deve retornar 400 se o conteúdo não for uma string", async () => {
    const token = makeToken();

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: 123, 
        type: "R",
        idUsuario: "valid-user-id",
        idTweet: "valid-tweet-id",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Conteúdo inválido!",
    });
  });

  // CONTEÚDO ACIMA DO LIMITE
  it("Deve retornar 400 se o conteúdo tiver mais de 300 caracteres", async () => {
    const token = makeToken();
    const longContent = "a".repeat(301);

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        conteudo: longContent,
        type: "R",
        idUsuario: "valid-user-id",
        idTweet: "valid-tweet-id",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "O conteúdo deve ter no máximo 300 caracteres!",
    });
  });

  // SUCESSO NA CRIAÇÃO
  it("Deve retornar 201 quando os dados são válidos", async () => {
    const token = makeToken();
    const replyData = {
      conteudo: "Meu novo reply",
      type: "R",
      idUsuario: "valid-user-id",
      idTweet: "valid-tweet-id",
    };

    jest.spyOn(ReplyService.prototype, "create").mockResolvedValue({
      ok: true,
      code: 201,
      message: "Resposta criada com sucesso!",
      data: replyData,
    });

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send(replyData);

    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Resposta criada com sucesso!");
    expect(response.body.data).toEqual(replyData);
  });
});
