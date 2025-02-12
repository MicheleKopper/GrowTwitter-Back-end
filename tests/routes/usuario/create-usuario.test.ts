import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { UsuarioService } from "../../../src/services";

describe("POST /usuarios", () => {
  const server = createServer();
  const endpoint = "/usuarios";

  //  __________________ MIDDLEWARE __________________
  // NOME AUSENTE
  it("Deve retornar 400 quando não for informado o nome", async () => {
    const response = await supertest(server).post(endpoint).send({
      username: "@michele",
      email: "michele@email.com",
      senha: "senha12",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Preencha o nome!",
    });
  });

  // USERNAME AUSENTE
  it("Deve retornar 400 quando não for informado o username", async () => {
    const response = await supertest(server).post(endpoint).send({
      nome: "Michele",
      email: "michele@email.com",
      senha: "senha12",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Preencha seu username!",
    });
  });

  // EMAIL AUSENTE
  it("Deve retornar 400 quando não for informado o email", async () => {
    const response = await supertest(server).post(endpoint).send({
      nome: "Michele",
      username: "@michele",
      senha: "senha12",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Preencha seu email!",
    });
  });

  // SENHA AUSENTE
  it("Deve retornar 400 quando não for informada a senha", async () => {
    const response = await supertest(server).post(endpoint).send({
      nome: "Michele",
      email: "michele@email.com",
      username: "@michele",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Preencha sua senha!",
    });
  });

  // NOME INVÁLIDO
  it("Deve retornar 400 quando o nome não for do tipo string", async () => {
    const response = await supertest(server).post(endpoint).send({
      nome: 123,
      email: "michele@email.com",
      username: "@michele",
      senha: "1234",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Nome inválido!",
    });
  });

  // USERNAME INVÁLIDO
  it("Deve retornar 400 quando o username não for do tipo string", async () => {
    const response = await supertest(server).post(endpoint).send({
      nome: "Michele",
      email: "michele@email.com",
      username: 123,
      senha: "1234",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Username inválido!",
    });
  });

  // EMAIL INVÁLIDO
  it("Deve retornar 400 quando o email não for do tipo string", async () => {
    const response = await supertest(server).post(endpoint).send({
      nome: "Michele",
      email: 123,
      username: "@michele",
      senha: "1234",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Email inválido!",
    });
  });

  // EMAIL INVÁLIDO
  it("Deve retornar 400 quando o email não tiver '@' e '.com'", async () => {
    const response = await supertest(server).post(endpoint).send({
      nome: "Michele",
      email: "michele.email",
      username: "@michele",
      senha: "1234",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Email inválido!",
    });
  });

  // SENHA INVÁLIDA
  it("Deve retornar 400 quando a senha for menor de 4 caracteres", async () => {
    const response = await supertest(server).post(endpoint).send({
      nome: "Michele",
      email: "michele@email.com",
      username: "@michele",
      senha: "12",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "A senha deve ter mínimo de 4 caracteres!",
    });
  });

  //  __________________ CONTROLLER __________________
  it.only("Deve retornar 201 ao criar um usuário com sucesso", async () => {
    const mockUsuario = {
      nome: "Michele",
      username: "@michele",
      email: "michele@email.com",
      senha: "senha123",
    };

    jest.spyOn(UsuarioService.prototype, "create").mockResolvedValue({
      ok: true,
      code: 201,
      message: "Usuário cadastrado com sucesso!",
      data: mockUsuario,
    });

    const response = await supertest(server).post(endpoint).send(mockUsuario);

    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Usuário cadastrado com sucesso!");
    expect(response.body.data).toEqual(mockUsuario);
  });
});
