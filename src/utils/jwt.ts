import jwt from "jsonwebtoken";
import { AuthUser } from "../types/user.type";

export class JWT {
  // Gerar o token
  public generateToken(data: AuthUser): string {
    if (!process.env.JWT_SECRET) {
      throw new Error("Segredo não definido!");
    }

    // jwt.sign(dados, palavraSecreta, configs)
    const token = jwt.sign(data, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  }

  // Verificar o token
  public verifyToken(token: string): AuthUser | null {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("Segredo não definido!");
      }

      const data = jwt.verify(token, process.env.JWT_SECRET) as AuthUser;
      return data;
    } catch {
      return null;
    }
  }
}
