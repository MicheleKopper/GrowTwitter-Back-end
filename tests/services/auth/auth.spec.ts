import { AuthService } from "../../../src/services/auth.service";
import { prismaMock } from "../../config/prisma.mock";
import { Bcrypt } from "../../../src/utils/bcrypt";
import { JWT } from "../../../src/utils/jwt";
import { UsuarioMock } from "../mocks/usuario.mock";
import { LoginDto } from "../../../src/dtos/auth.dto";

describe("Auth login", () => {
  const createSut = () => new AuthService(); 

  it("Deve realizar login com sucesso", async () => {
    const sut = createSut();
    const usuarioMock = UsuarioMock.build({ senha: "senha123" });

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
    jest.spyOn(Bcrypt.prototype, "verify").mockResolvedValue(true);
    jest
      .spyOn(JWT.prototype, "generateToken")
      .mockReturnValue("token_simulado");

    const loginData: LoginDto = {
      email: usuarioMock.email,
      senha: "senha123",
    };
    const response = await sut.login(loginData);

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.data?.token).toBe("token_simulado");
  });

  it("Deve retornar erro 401 se o usuário não for encontrado", async () => {
    const sut = createSut();

    prismaMock.usuario.findUnique.mockResolvedValue(null);

    const loginData: LoginDto = {
      email: "email@naoexiste.com",
      senha: "senha123",
    };
    const response = await sut.login(loginData);

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(401);
  });

  it("Deve retornar erro 401 se a senha estiver incorreta", async () => {
    const sut = createSut();
    const usuarioMock = UsuarioMock.build({ senha: "senha123" });

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
    jest.spyOn(Bcrypt.prototype, "verify").mockResolvedValue(false);

    const loginData: LoginDto = {
      email: usuarioMock.email,
      senha: "senhaErrada",
    };
    const response = await sut.login(loginData);

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(401);
  });

  it("Deve retornar erro 500 se ocorrer uma exceção inesperada", async () => {
    const sut = createSut();

    prismaMock.usuario.findUnique.mockRejectedValue(
      new Error("Erro inesperado")
    );

    const loginData: LoginDto = { email: "email@email.com", senha: "senha123" };
    const response = await sut.login(loginData);

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(500);
  });
});
