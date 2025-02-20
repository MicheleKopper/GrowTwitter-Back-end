import { LikeService } from "../../../src/services/like.service";
import { prismaMock } from "../../config/prisma.mock";
import { LikesMock } from "../mocks/like.mock";

describe("Like create", () => {
  const createSut = () => new LikeService();

  it("Deve adicionar um like com sucesso quando não houver conflito", async () => {
    const sut = createSut();

    // Criando mock de like e tweet
    const likeMock = LikesMock.build({
      idUsuario: "user-123",
      idTweet: "tweet-123",
    });

    // Configurando o retorno do mock
    prismaMock.tweet.findUnique.mockResolvedValue(likeMock.tweet); // Mock de tweet
    prismaMock.like.findFirst.mockResolvedValue(null); // Não há like existente
    prismaMock.like.create.mockResolvedValue({
      id_like: "like-123",
      idUsuario: likeMock.idUsuario,
      idTweet: likeMock.idTweet,
    }); // Mock de criação de like

    const response = await sut.create({
      idUsuario: likeMock.idUsuario,
      idTweet: likeMock.idTweet,
    });

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(201);
    expect(response.message).toBe("Like adicionado com sucesso!");
  });

  it("Deve retornar erro 409 se o tweet não existir", async () => {
    const sut = createSut();

    // Criando mock de like
    const likeMock = LikesMock.build({
      idUsuario: "user-123",
      idTweet: "tweet-123",
    });

    // Configurando o retorno do mock
    prismaMock.tweet.findUnique.mockResolvedValue(null); // Não existe tweet com o id

    const response = await sut.create({
      idUsuario: likeMock.idUsuario,
      idTweet: likeMock.idTweet,
    });

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(409);
    expect(response.message).toBe("Tweet não encontrado!");
  });

  it("Deve retornar erro 409 se o like já existir", async () => {
    const sut = createSut();

    // Criando mock de like
    const likeMock = LikesMock.build({
      idUsuario: "user-123",
      idTweet: "tweet-123",
    });

    // Configurando o retorno do mock
    prismaMock.tweet.findUnique.mockResolvedValue(likeMock.tweet); // Mock de tweet
    prismaMock.like.findFirst.mockResolvedValue(likeMock); // Já existe like

    const response = await sut.create({
      idUsuario: likeMock.idUsuario,
      idTweet: likeMock.idTweet,
    });

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(409);
    expect(response.message).toBe("Você já deu like neste tweet!");
  });
});
