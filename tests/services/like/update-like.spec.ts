import { LikeService } from "../../../src/services/like.service";
import { prismaMock } from "../../config/prisma.mock";
import { LikesMock } from "../mocks/like.mock";

describe("Like update", () => {
  const createSut = () => new LikeService();

  it("Deve atualizar o like com sucesso", async () => {
    const sut = createSut();

    // Criando mock de like
    const likeMock = LikesMock.build({
      idUsuario: "user-123",
      idTweet: "tweet-123",
    });

    // Configurando o retorno do mock
    prismaMock.like.findUnique.mockResolvedValue(likeMock);
    prismaMock.like.update.mockResolvedValue({
      id_like: likeMock.id_like,
      idUsuario: likeMock.idUsuario,
      idTweet: "new-tweet-id",
    });

    const response = await sut.update(likeMock.id_like, {
      idTweet: "new-tweet-id",
    });

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Like atualizado com sucesso!");
    expect(response.data.idTweet).toBe("new-tweet-id");
  });

  it("Deve retornar erro 404 se o like não for encontrado", async () => {
    const sut = createSut();

    // Configurando o retorno do mock
    prismaMock.like.findUnique.mockResolvedValue(null); // Like não encontrado

    const response = await sut.update("like-123", { idTweet: "new-tweet-id" });

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Like não encontrado!");
  });
});
