import supertest from "supertest";
import { createServer } from "../../../src/express.server";

describe("DELETE /tweets/:id_tweet", () => {
  const server = createServer();
  const endpoint = "/tweets";

  // TOKEN AUSENTE
  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(endpoint);

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autenticado!",
    });
  });

  // TOKEN INVÁLIDO
  it("Deve retornar 401 quando for informado um token inválido", async () => {
    const response = await supertest(server)
      .put("/tweets/valid-tweet-id")
      .set("Authorization", "Bearer any_token");

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      ok: false,
      message: "Não autenticado!",
    });
  });
});
