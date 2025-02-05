import { CreateUsuarioDto } from "../../../src/dtos";
import { UsuarioService } from "../../../src/services/usuario.service";
import { Bcrypt } from "../../../src/utils/bcrypt";
import { prismaMock } from "../../config/prisma.mock";
import { UsuarioMock } from "../mocks/usuario.mock";

// Função para criar um objeto DTO de usuário para testes
const makeCreateUsuario = (params?: Partial<CreateUsuarioDto>) => ({
  nome: params?.nome || "novo_nome", // Usa o nome passado ou um padrão
  username: params?.username || "novo_username",
  email: params?.email || "novo_email",
  senha: params?.senha || "nova_senha",
});

describe("Create user service", () => {
  // Criar uma instância do serviço antes de cada teste
  const createSut = () => new UsuarioService();

  // NOME EM USO
  it("Deve retornar erro se o nome já estiver sendo utilizado", async () => {
    const sut = createSut();
    const dto = makeCreateUsuario({ nome: "novo_nome" });
    const usuarioMock = UsuarioMock.build({ nome: dto.nome });

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);

    const response = await sut.create(dto);

    expect(response).toEqual({
      ok: false,
      code: 409,
      message: "Nome já está em uso",
    });

    // Verifica se a função do Prisma foi chamada apenas uma vez
    expect(prismaMock.usuario.findUnique).toHaveBeenCalledTimes(1);
  });

  // NOME INVÁLIDO
  it("Deve retornar erro ao cadastrar um nome inválido", async () => {
    const sut = createSut();
    const dto = makeCreateUsuario({ nome: "" });

    const response = await sut.create(dto);

    expect(response).toEqual({
      ok: false,
      code: 400,
      message: "Nome não pode estar vazio",
    });
  });

  // USERNAME EM USO
  it("Deve retornar erro se o username já estiver sendo utilizado", async () => {
    const sut = createSut();
    const dto = makeCreateUsuario({ username: "novo_username" });
    const usuarioMock = UsuarioMock.build({ username: dto.username });

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);

    const response = await sut.create(dto);

    expect(response).toEqual({
      ok: false,
      code: 409,
      message: "Username já está em uso",
    });
  });

  // USERNAME INVÁLIDO
  it("Deve retornar erro ao cadastrar um username inválido", async () => {
    const sut = createSut();
    const dto = makeCreateUsuario({ username: "username com espaço" });

    const response = await sut.create(dto);

    expect(response).toEqual({
      ok: false,
      code: 400,
      message: "Username não pode conter espaços ou caracteres especiais",
    });
  });

  // EMAIL EM USO
  it("Deve retornar erro se o email já estiver sendo utilizado", async () => {
    const sut = createSut(); // Cria uma instância do serviço
    const dto = makeCreateUsuario({ email: "mi@gmail.com" }); // Simula um usuário com email já cadastrado
    const usuarioMock = UsuarioMock.build({ email: "mi@gmail.com" }); // Cria um mock de usuário com esse email

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock); // Simula que o banco já tem um usuário com esse email

    const result = await sut.create(dto); // Chama o serviço para criar o usuário

    expect(result.ok).toBe(false);
    expect(result.code).toBe(409);
    expect(result).toHaveProperty("message", "Este email já está em uso!");
  });

  // EMAIL INVÁLIDO
  it("Deve retornar erro ao cadastrar um email inválido", async () => {
    const sut = createSut();
    const dto = makeCreateUsuario({ email: "email com espaço" });

    const response = await sut.create(dto);

    expect(response).toEqual({
      ok: false,
      code: 400,
      message: "Email não pode conter espaços",
    });
  });
  
  // USUÁRIO
  it("Deve retornar o usuário criando com sucesso!", async () => {
    const sut = createSut();
    const dto = makeCreateUsuario();
    const usuarioMock = UsuarioMock.build();

    // Simula que o usuário não existe
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    jest.spyOn(Bcrypt.prototype, "generateHash").mockResolvedValue("any_hash");

    prismaMock.usuario.create.mockResolvedValue(usuarioMock);

    const response = await sut.create(dto);

    expect(response.data).toEqual({
      id_usuario: expect.any(String),
      nome: usuarioMock.nome,
      username: usuarioMock.username,
      email: usuarioMock.email,
      senha: usuarioMock.senha,
    });

    expect(response.ok).toBe(true);
    expect(response.code).toBe(201);
    expect(response.message).toBe("usuário cadastrado com sucesso!");

    expect(Bcrypt.prototype.generateHash).toHaveBeenCalledTimes(1);
    expect(prismaMock.usuario.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.usuario.create).toHaveBeenCalledTimes(1);
  });
});
