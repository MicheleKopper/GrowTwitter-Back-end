import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { LikeService } from "../../../src/services/like.service";

describe("GET /likes", () => {
  const server = createServer();
  const endpoint = "/likes";

  // TOKEN VÁLIDO
  it("Deve retornar 200 quando informado o token", async () => {
    const token = makeToken();

    const mockService = {
      ok: true,
      code: 200,
      message: "Likes listados com sucesso!",
      data: [],
    };

    jest.spyOn(LikeService.prototype, "findAll").mockResolvedValue(mockService);

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  // ______________ CONTROLLER ______________

  // FILTRO VÁLIDO
  it("Deve retornar 200 e uma lista de likes", async () => {
    const token = makeToken();

    // Mock de 10 likes
    const mockLikes = Array.from({ length: 10 }, () => {
      return {
        idUsuario: "user1",
        idTweet: "tweet1",
      };
    });

    // Mockar o serviço para retornar esses likes
    jest.spyOn(LikeService.prototype, "findAll").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Likes listados com sucesso!",
      data: mockLikes,
    });

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Likes listados com sucesso!");
    expect(response.body.data).toEqual(mockLikes);
  });

  // ERRO NO SERVIDOR
  it("Deve retornar 500 se ocorrer um erro interno no servidor", async () => {
    const token = makeToken();

    jest
      .spyOn(LikeService.prototype, "findAll")
      .mockRejectedValue(new Error("Erro inesperado"));

    const response = await supertest(server)
      .get(endpoint)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Erro do servidor: Erro inesperado");
  });
});
