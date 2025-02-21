import { UsuarioService } from "../../../src/services/usuario.service";
import { prismaMock } from "../../config/prisma.mock";
import { Bcrypt } from "../../../src/utils/bcrypt";
import { UsuarioMock } from "../mocks/usuario.mock";

describe("Usuario create", () => {
  const createSut = () => new UsuarioService(); 

  it("Deve criar um usuário com sucesso", async () => {
    const sut = createSut();
    const usuarioMock = UsuarioMock.build({ senha: "senhaSegura123" });

    // Simulando o hash da senha
    const senhaHashed = "hash_simulado";
    jest.spyOn(Bcrypt.prototype, "generateHash").mockResolvedValue(senhaHashed);

    // Simulando a criação no banco de dados
    prismaMock.usuario.findUnique.mockResolvedValue(null); 
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

  it("Deve retornar erro 500 se ocorrer uma exceção inesperada", async () => {
    const sut = createSut();
    const usuarioMock = UsuarioMock.build();

    prismaMock.usuario.create.mockRejectedValue(new Error("Erro inesperado"));

    const response = await sut.create(usuarioMock);

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(500);
    expect(response.message).toBe("Erro ao criar usuário: Erro inesperado");
  });
});
