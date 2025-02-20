import { ReplyService } from "../../../src/services/reply.service";
import { prismaMock } from "../../config/prisma.mock";
import { ReplyMock } from "../mocks/reply.mock";

describe("ReplyService", () => {
  const createSut = () => new ReplyService();

  it("Deve retornar uma resposta quando o ID for válido", async () => {
    const sut = createSut();
    const replyMock = ReplyMock.build();

    prismaMock.reply.findUnique.mockResolvedValue(replyMock);

    const response = await sut.findOneById("valid-id");

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Reply encontrado com sucesso!");
    expect(response.data).toMatchObject(replyMock);
  });

  it("Deve retornar erro 404 quando o ID não for encontrado", async () => {
    const sut = createSut();

    prismaMock.reply.findUnique.mockResolvedValue(null);

    const response = await sut.findOneById("invalid-id");

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Reply não encontrado.");
  });
});
