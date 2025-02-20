import { ReplyService } from "../../../src/services/reply.service";
import { prismaMock } from "../../config/prisma.mock";
import { ReplyMock } from "../mocks/reply.mock";

describe("ReplyService", () => {
  const createSut = () => new ReplyService();

  it("Deve deletar uma resposta com sucesso", async () => {
    const sut = createSut();
    const replyMock = ReplyMock.build();

    prismaMock.reply.findUnique.mockResolvedValue(replyMock);
    prismaMock.reply.delete.mockResolvedValue(replyMock);

    const response = await sut.delete("valid-id");

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Reply deletado com sucesso!");
    expect(response.data).toMatchObject(replyMock);
  });

  it("Deve retornar erro 404 se o reply não for encontrado", async () => {
    const sut = createSut();

    prismaMock.reply.findUnique.mockResolvedValue(null);

    const response = await sut.delete("invalid-id");

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Reply não encontrado!");
  });
});
