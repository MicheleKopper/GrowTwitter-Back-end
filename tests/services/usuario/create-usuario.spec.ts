import { UsuarioService } from "../../../src/services/usuario.service";
import { prismaMock } from "../../config/prisma.mock";
import { Bcrypt } from "../../../src/utils/bcrypt";
import { UsuarioMock } from "../mocks/usuario.mock";
jest.mock("../../../src/utils/bcrypt");

describe("Create user", () => {
  const createSut = () => new UsuarioService();

  it("Deve criar um usuário com sucesso", async () => {
    const sut = createSut();

    // Criando um usuário mockado
    const usuarioMock = UsuarioMock.build({ senha: "senhaSegura123" });

    // Simulando o hash da senha
    const senhaHashed = "hash_simulado";
    (Bcrypt.prototype.generateHash as jest.Mock).mockResolvedValue(senhaHashed);

    // Simulando a criação no banco de dados
    prismaMock.usuario.findUnique.mockResolvedValue(null); // Email não cadastrado
    prismaMock.usuario.create.mockResolvedValue({
      ...usuarioMock,
      senha: senhaHashed, // Senha hashada
    });

    // Chamando a função
    const response = await sut.create(usuarioMock);

    // Validações
    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(201);
    expect(response.message).toBe("Usuário cadastrado com sucesso!");
    expect(response.data).toMatchObject({
      nome: usuarioMock.nome,
      username: usuarioMock.username,
      email: usuarioMock.email,
    });

    // Verifica se a senha foi realmente hashada
    expect(response.data.senha).toBe(senhaHashed);
  });

  it("Deve retornar erro 409 se o email já estiver em uso", async () => {
    const sut = createSut();

    const usuarioMock = UsuarioMock.build();

    // Simulando que o email já está cadastrado
    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);

    // Chamando a função
    const response = await sut.create(usuarioMock);

    // Validações
    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(409);
    expect(response.message).toBe("Este email já está em uso!");
  });
});
