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

  // TESTE 01 - EMAIL
  it("Deve retornar erro se o emial já estiver sendo utilizado", async () => {
    const sut = createSut(); // Cria uma instância do serviço
    const dto = makeCreateUsuario({ email: "mi@gmail.com" }); // Simula um usuário com email já cadastrado
    const usuarioMock = UsuarioMock.build({ email: "mi@gmail.com" }); // Cria um mock de usuário com esse email

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock); // Simula que o banco já tem um usuário com esse email

    const result = await sut.create(dto); // Chama o serviço para criar o usuário

    expect(result.ok).toBe(false);
    expect(result.code).toBe(409);
    expect(result).toHaveProperty("message", "Este email já está em uso!");
  });

  // TESTE 02 - NOME
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

  // TESTE 03 - USUÁRIO
  it("Deve retornar o usuário criando com sucesso!", async () => {
    const sut = createSut();
    const dto = makeCreateUsuario();
    const usuarioMock = UsuarioMock.build();
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
