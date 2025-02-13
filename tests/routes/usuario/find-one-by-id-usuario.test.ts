import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { UsuarioService } from "../../../src/services/usuario.service";
import { UsuarioMock } from "../../services/mocks/usuario.mock";
import { makeToken } from "../make-token";

describe("GET /usuarios/:id_usuario", () => {
  const server = createServer();
  const endpoint = "/usuarios";

  // FILTRO VÁLIDO
  it("Deve retornar 200 e os dados do usuário quando informado um ID válido", async () => {
    const token = makeToken();

    // Criando o usuário mockado
    const usuario = UsuarioMock.build({
      nome: "Michele",
      username: "@michele",
    });

    const mockService = {
      ok: true,
      code: 200,
      message: "Usuário encontrado!",
      data: usuario,
    };

    jest
      .spyOn(UsuarioService.prototype, "findOneById")
      .mockResolvedValue(mockService);

    // Act - Faz a requisição para o Controller
    const response = await supertest(server)
      .get(`${endpoint}/${usuario.id_usuario}`)
      .set("Authorization", `Bearer ${token}`)
      .send(mockService);

    // Asserts
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Usuário encontrado!");
    expect(response.body.data).toEqual(usuario);
  });
});
