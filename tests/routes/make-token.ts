import { randomUUID } from "crypto";
import { JWT } from "../../src/utils/jwt";
import { AuthUser } from "../../src/types/user.type";

export function makeToken(params?: Partial<AuthUser>) {
  const payload: AuthUser = {
    id: randomUUID(),
    name: params?.name || "Michele",
    email: params?.email || "michele@email.com",
  };
  const jwt = new JWT();
  const token = jwt.generateToken(payload);

  return token;
}
