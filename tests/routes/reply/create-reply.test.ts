import supertest from "supertest";
import { randomUUID } from "crypto";
import { makeToken } from "../make-token";
import { createServer } from "../../../src/express.server";
import { ReplyService } from "../../../src/services/reply.service";

describe("POST /replies", () => {
  const server = createServer();
  const endpoint = "/replies";
  const token = "Bearer " + makeToken(); // Simula um token válido
  const validUuid = randomUUID();

  const replyData = {
    conteudo: "Isso é uma resposta!",
    type: "R",
    idUsuario: validUuid,
    idTweet: validUuid,
  };

  // Caso de sucesso - Resposta criada com sucesso
  it("Deve retornar 201 quando a resposta for criada com sucesso", async () => {
    jest.spyOn(ReplyService.prototype, "create").mockResolvedValue({
      ok: true,
      code: 201,
      message: "Resposta criada com sucesso!",
      data: replyData,
    });

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", token)
      .send(replyData);

    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Resposta criada com sucesso!");
    expect(response.body.data).toEqual(replyData);
  });

  // Caso de erro - Conteúdo vazio
  it("Deve retornar 400 quando o conteúdo estiver vazio", async () => {
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", token)
      .send({ ...replyData, conteudo: "" });

    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Preencha o conteúdo!");
  });

  // Caso de erro - Tipo de tweet inválido
  it("Deve retornar 400 quando o tipo de tweet for diferente de 'R'", async () => {
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", token)
      .send({ ...replyData, type: "T" });

    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe(
      "Tweet precisa ser do tipo 'R' (Reply)!"
    );
  });

  // Caso de erro - ID do tweet ausente
  it("Deve retornar 400 quando o ID do tweet não for informado", async () => {
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", token)
      .send({ ...replyData, idTweet: undefined });

    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Preencha o ID do Tweet!");
  });

  // Caso de erro - Conteúdo muito longo
  it("Deve retornar 400 quando o conteúdo ultrapassar 300 caracteres", async () => {
    const longContent = "a".repeat(301);
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", token)
      .send({ ...replyData, conteudo: longContent });

    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe(
      "O conteúdo deve ter no máximo 300 caracteres!"
    );
  });

  // Caso de erro - Falha na autenticação
  it("Deve retornar 401 quando o usuário não estiver autenticado", async () => {
    const response = await supertest(server).post(endpoint).send(replyData); // Sem token

    expect(response.statusCode).toBe(401);
    expect(response.body.ok).toBe(false);
  });
});
