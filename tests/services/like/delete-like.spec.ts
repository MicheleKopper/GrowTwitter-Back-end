import { LikeService } from "../../../src/services/like.service";
import { prismaMock } from "../../config/prisma.mock";
import { LikesMock } from "../mocks/like.mock";

describe("Like delete", () => {
  const createSut = () => new LikeService();
  it("Deve deletar o like com sucesso", async () => {
    const sut = createSut();

    // Criando mock de like
    const likeMock = LikesMock.build({
      idUsuario: "user-123",
      idTweet: "tweet-123",
    });

    // Configurando o retorno do mock
    prismaMock.like.findUnique.mockResolvedValue(likeMock);
    prismaMock.like.delete.mockResolvedValue(likeMock);

    const response = await sut.delete(likeMock.id_like);

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Like deletado com sucesso!");
  });

  it("Deve retornar erro 404 se o like não for encontrado para deletar", async () => {
    const sut = createSut();

    // Configurando o retorno do mock
    prismaMock.like.findUnique.mockResolvedValue(null); 

    const response = await sut.delete("like-123");

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Like não encontrado!");
  });
});
