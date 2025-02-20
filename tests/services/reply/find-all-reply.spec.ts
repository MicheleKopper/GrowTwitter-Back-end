import { ReplyService } from "../../../src/services/reply.service";
import { prismaMock } from "../../config/prisma.mock";
import { ReplyMock } from "../mocks/reply.mock"; // Adapte esse caminho para seu mock

describe("ReplyService", () => {
  const createSut = () => new ReplyService();

  it("Deve retornar todas as respostas com sucesso", async () => {
    const sut = createSut();
    const repliesMock = [ReplyMock.build(), ReplyMock.build()];

    prismaMock.reply.findMany.mockResolvedValue(repliesMock);

    const response = await sut.findAll();

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Replies listados com sucesso!");
    expect(response.data).toHaveLength(2);
  });
});
