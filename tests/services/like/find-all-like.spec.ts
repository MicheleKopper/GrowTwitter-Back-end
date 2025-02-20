import { LikeService } from "../../../src/services/like.service";
import { prismaMock } from "../../config/prisma.mock";
import { LikesMock } from "../mocks/like.mock";

describe("Like findAll", () => {
  const createSut = () => new LikeService();

  it("Deve retornar todos os likes com sucesso", async () => {
    const sut = createSut();

    // Criando mock de likes
    const likeMock = LikesMock.build({
      idUsuario: "user-123",
      idTweet: "tweet-123",
    });

    // Configurando o retorno do mock
    prismaMock.like.findMany.mockResolvedValue([likeMock]); // Retorna lista de likes

    const response = await sut.findAll({ idTweet: "tweet-123" });

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Likes encontrados com sucesso!");
    expect(response.data).toHaveLength(1);
    expect(response.data[0].id_like).toBe(likeMock.id_like);
  });
});
