import { ReplyService } from "../../../src/services/reply.service";
import { prismaMock } from "../../config/prisma.mock";
import { CreateReplyDto } from "../../../src/dtos/reply.dto";
import { ReplyMock } from "../mocks/reply.mock";

describe("ReplyService", () => {
  const createSut = () => new ReplyService();

  it("Deve criar uma resposta com sucesso", async () => {
    const sut = createSut();
    const replyMock = ReplyMock.build();

    const createReplyDto: CreateReplyDto = {
      conteudo: "Resposta de teste",
      type: "R",
      idUsuario: "user-id",
      idTweet: "tweet-id",
    };

    prismaMock.reply.create.mockResolvedValue(replyMock);

    const response = await sut.create(createReplyDto);

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(201);
    expect(response.message).toBe("Resposta criada com sucesso!");
    expect(response.data).toMatchObject({
      conteudo: replyMock.conteudo,
      type: replyMock.type,
    });
  });

  it("Deve retornar erro ao tentar criar resposta", async () => {
    const sut = createSut();
    const createReplyDto: CreateReplyDto = {
      conteudo: "Resposta de teste",
      type: "R",
      idUsuario: "user-id",
      idTweet: "tweet-id",
    };

    prismaMock.reply.create.mockRejectedValue(
      new Error("Erro ao criar resposta")
    );

    const response = await sut.create(createReplyDto);

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(500);
    expect(response.message).toBe("Erro ao criar resposta.");
  });
});
