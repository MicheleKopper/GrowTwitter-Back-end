import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { UsuarioMock } from "../../services/mocks/usuario.mock";
import { UsuarioService } from "../../../src/services/usuario.service";

describe("PUT /usuarios/:id_usuario", () => {
  const server = createServer();
  const endpoint = "/usuarios";

  //  __________________ CONTROLLER __________________

  describe("PUT /usuarios/:id_usuario", () => {
    const server = createServer();
    const endpoint = "/usuarios";

    it("Deve retornar 200 e atualizar os dados do usuário quando informado um ID válido", async () => {
      const token = makeToken();
      const usuario = UsuarioMock.build({ id_usuario: "valid-uuid" });

      // Mock do serviço
      const mockService = {
        ok: true,
        code: 200,
        message: "Usuário atualizado com sucesso!",
        data: { ...usuario, nome: "Theo Kopper", username: "@theo" },
      };

      jest
        .spyOn(UsuarioService.prototype, "update")
        .mockResolvedValue(mockService);

      const response = await supertest(server)
        .put(`${endpoint}/${usuario.id_usuario}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ nome: "Theo Kopper", username: "@theo" });

      expect(response.statusCode).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe("Usuário atualizado com sucesso!");
      expect(response.body.data.nome).toBe("Theo Kopper");
      expect(response.body.data.username).toBe("@theo");
    });

    //  __________________ MIDDLEWARE __________________

    it("Deve retornar 400 quando o nome for menor que 3 caracteres", async () => {
      const token = makeToken();
      const usuario = UsuarioMock.build({ id_usuario: "valid-uuid" });

      const response = await supertest(server)
        .put(`${endpoint}/${usuario.id_usuario}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ nome: "M" });

      expect(response.statusCode).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe(
        "Nome deve conter mínimo 3 caracteres!"
      );
    });

    it("Deve retornar 400 quando o username for menor que 3 caracteres", async () => {
      const token = makeToken();
      const usuario = UsuarioMock.build({ id_usuario: "valid-uuid" });

      const response = await supertest(server)
        .put(`${endpoint}/${usuario.id_usuario}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "@m" });

      expect(response.statusCode).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe(
        "Username deve conter mínimo 3 caracteres!"
      );
    });

    it("Deve retornar 400 quando o UUID do usuário for inválido", async () => {
      const token = makeToken();

      const response = await supertest(server)
        .put(`${endpoint}/12345`) // UUID inválido
        .set("Authorization", `Bearer ${token}`)
        .send({ nome: "Nome Válido", username: "@usernamevalido" });

      expect(response.statusCode).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Identificador precisa ser um Uuid!"); 
    });
  });
});
