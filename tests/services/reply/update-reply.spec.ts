import { ReplyService } from "../../../src/services/reply.service";
import { prismaMock } from "../../config/prisma.mock";
import { ReplyMock } from "../mocks/reply.mock"; // Adapte esse caminho para seu mock
import { UpdateReplyDto } from "../../../src/dtos/reply.dto";

describe("Reply update", () => {
  const createSut = () => new ReplyService();

  it("Deve atualizar uma resposta com sucesso", async () => {
    const sut = createSut();
    const replyMock = ReplyMock.build();
    const updateReplyDto: UpdateReplyDto = {
      conteudo: "Novo conteúdo da resposta",
    };

    prismaMock.reply.findUnique.mockResolvedValue(replyMock);
    prismaMock.reply.update.mockResolvedValue({
      ...replyMock,
      ...updateReplyDto,
    });

    const response = await sut.update("valid-id", updateReplyDto);

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Tweet atualizado com sucesso!");
    expect(response.data.conteudo).toBe(updateReplyDto.conteudo);
  });

  it("Deve retornar erro 404 se o reply não for encontrado", async () => {
    const sut = createSut();
    const updateReplyDto: UpdateReplyDto = {
      conteudo: "Novo conteúdo da resposta",
    };

    prismaMock.reply.findUnique.mockResolvedValue(null);

    const response = await sut.update("invalid-id", updateReplyDto);

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Reply não encontrado!");
  });
});
