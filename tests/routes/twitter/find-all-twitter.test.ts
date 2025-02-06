import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { TwitterRoutes } from "../../../src/routes/twitter.routes";
import { TwitterService } from "../../../src/services/twitter.service";
import { ResponseApi } from "../../../src/types";

describe("GET /tweets", () => {
  const server = createServer();
  const endpoint = "/tweets";

  it("Deve retornar 401 quando não for informado o token", async () => {
    const response = await supertest(server).get(endpoint);

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autenticado!",
    });
  });

  it("Deve retornar 401 quando for informado o token inválido", async () => {
    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", "Bearer any_token");

    expect(response).toHaveProperty("statusCode", 401);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: "Não autenticado!",
    });
  });

  it("Deve retornar 200 quando informado o token", async () => {
    const token = makeToken();

    const mockService = {
      ok: true,
      code: 200,
      message: "Tweets listados com sucesso!",
      data: [],
    };

    jest
      .spyOn(TwitterService.prototype, "findAll")
      .mockResolvedValue(mockService);
    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response).toHaveProperty("statusCode", 200);
  });
});
