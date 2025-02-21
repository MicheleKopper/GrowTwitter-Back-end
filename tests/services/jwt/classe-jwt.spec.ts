import { AuthUser } from "../../../src/types/user.type";
import { JWT } from "../../../src/utils/jwt";

describe("Classe JWT", () => {
  const jwtService = new JWT();

  it("deve lançar um erro se JWT_SECRET não estiver definido", () => {
    delete process.env.JWT_SECRET;

    const user: AuthUser = {
      id: "1", // id como string
      nome: "Nome do Usuário",
      username: "user",
      email: "user@example.com",
    };

    expect(() => {
      jwtService.generateToken(user);
    }).toThrow("Segredo não definido!");
  });

  it("deve gerar um token válido", () => {
    process.env.JWT_SECRET = "testsecret"; // Definir uma chave secreta temporária

    const user: AuthUser = {
      id: "1", // id como string
      nome: "Nome do Usuário",
      username: "user",
      email: "user@example.com",
    };

    const token = jwtService.generateToken(user);

    // Verifique se o token gerado é uma string e tem o formato correto
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // O token JWT tem 3 partes
  });
});
