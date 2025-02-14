import supertest from "supertest";
import { randomUUID } from "crypto";
import { makeToken } from "../make-token";
import { createServer } from "../../../src/express.server";
import { UsuarioService } from "../../../src/services/usuario.service";

describe("DELETE /usuarios/:id_usuario", () => {
  const server = createServer();
  const endpoint = "/usuarios";
  const token = "Bearer " + makeToken(); // Simula um token válido
  const validUuid = randomUUID();

  // Caso de sucesso - Usuário deletado com sucesso
  it("Deve retornar 200 quando o usuário for deletado com sucesso", async () => {
    // Mockando o serviço para simular sucesso
    jest.spyOn(UsuarioService.prototype, "delete").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Usuário deletado com sucesso!",
    });

    const response = await supertest(server)
      .delete(`${endpoint}/${validUuid}`)
      .set("Authorization", token);

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Usuário deletado com sucesso!");
  });

  // Caso de erro - UUID inválido
  it("Deve retornar 400 quando o UUID do usuário for inválido", async () => {
    const invalidUuid = "12345"; // UUID inválido

    const response = await supertest(server)
      .delete(`${endpoint}/${invalidUuid}`)
      .set("Authorization", token);

    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Identificador precisa ser um Uuid!");
  });

  // Caso de erro - Usuário não encontrado
  it("Deve retornar 404 quando o usuário não for encontrado", async () => {
    jest.spyOn(UsuarioService.prototype, "delete").mockResolvedValue({
      ok: false,
      code: 404,
      message: "Usuário não encontrado!",
    });

    const response = await supertest(server)
      .delete(`${endpoint}/${validUuid}`)
      .set("Authorization", token);

    expect(response.statusCode).toBe(404);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("Usuário não encontrado!");
  });

  // Caso de erro - Falha na autenticação
  it("Deve retornar 401 quando o usuário não estiver autenticado", async () => {
    const response = await supertest(server).delete(`${endpoint}/${validUuid}`); // Sem o token de autenticação

    expect(response.statusCode).toBe(401);
    expect(response.body.ok).toBe(false);
  });
});
