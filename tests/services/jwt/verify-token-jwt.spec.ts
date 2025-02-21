import { AuthUser } from "../../../src/types/user.type";
import { JWT } from "../../../src/utils/jwt";

describe("Classe JWT - verifyToken", () => {
  const jwtService = new JWT();

  it("Deve retornar os dados se o token for válido", () => {
    process.env.JWT_SECRET = "testsecret";

    const user: AuthUser = {
      id: "1",
      nome: "Nome do Usuário",
      username: "user",
      email: "user@example.com",
    };

    // Gere o token para o usuário
    const token = jwtService.generateToken(user);

    // Verifique a verificação do token
    const verifiedData = jwtService.verifyToken(token);

    // Validação das propriedades
    expect(verifiedData).toBeDefined();
    expect(verifiedData?.id).toBe(user.id);
    expect(verifiedData?.username).toBe(user.username);
    expect(verifiedData?.nome).toBe(user.nome);
    expect(verifiedData?.email).toBe(user.email);
  });

  it("Deve retornar null se o token for inválido", () => {
    process.env.JWT_SECRET = "testsecret";

    const invalidToken = "invalid.token.string";

    const result = jwtService.verifyToken(invalidToken);

    expect(result).toBeNull();
  });
});
