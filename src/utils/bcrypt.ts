import bcrypt from "bcrypt";

export class Bcrypt {
  // Mistura a senha (cria o hash)
  public async generateHash(senha: string): Promise<string> {
    const hash = await bcrypt.hash(senha, Number(process.env.BCRYPT_SALT));
    return hash;
  }

  // Verifica o hash
  public async verify(senha: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(senha, hash);
    return isValid;
  }
}
