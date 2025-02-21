import { Bcrypt } from "../../../src/utils/bcrypt";
import bcrypt from "bcrypt";

// Mock do bcrypt para evitar chamadas reais de hash durante os testes
jest.mock("bcrypt");

describe("Bcrypt", () => {
  const bcryptInstance = new Bcrypt();

  beforeAll(() => {
    // Mock do hash e compare
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
    bcrypt.compare = jest.fn().mockResolvedValue(true);
  });

  it("deve gerar um hash", async () => {
    const senha = "minhaSenhaSecreta";
    const hash = await bcryptInstance.generateHash(senha);

    // Verifique se o bcrypt.hash foi chamado corretamente
    expect(bcrypt.hash).toHaveBeenCalledWith(
      senha,
      Number(process.env.BCRYPT_SALT)
    );
    expect(hash).toBe("hashedPassword"); // A senha gerada deve ser igual ao valor mockado
  });

  it("deve verificar um hash corretamente", async () => {
    const senha = "minhaSenhaSecreta";
    const hash = "hashedPassword";

    const isValid = await bcryptInstance.verify(senha, hash);

    // Verifique se bcrypt.compare foi chamado corretamente
    expect(bcrypt.compare).toHaveBeenCalledWith(senha, hash);
    expect(isValid).toBe(true); // O valor mockado retornado pelo compare
  });

  it("deve retornar falso se a senha for inválida", async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Mudando o retorno mockado

    const senha = "minhaSenhaSecreta";
    const hash = "hashedPassword";

    const isValid = await bcryptInstance.verify(senha, hash);

    expect(isValid).toBe(false); // Agora deve retornar false
  });
});
