import { TwitterService } from "../../../src/services/twitter.service";
import { prismaMock } from "../../config/prisma.mock";
import { TweetType } from "@prisma/client";

describe("Create twitter", () => {
  const createSut = () => new TwitterService();

  it("Deve criar um tweet com sucesso", async () => {
    const sut = createSut();

    const tweetMock = {
      conteudo: "Novo tweet de teste",
      type: TweetType.T,
      idUsuario: "user-123",
      idTweetPai: null, 
    };

    // Simula a criação do tweet no banco
    prismaMock.tweet.create.mockResolvedValue({
      id_tweet: "tweet-123",
      ...tweetMock,
    });

    // Chama o método de criação
    const result = await sut.create(tweetMock);

    // Verificações
    expect(result.ok).toBeTruthy();
    expect(result.code).toBe(201);
    expect(result.message).toBe("Tweet criado com sucesso!");
    expect(result.data).toMatchObject(tweetMock);
  });
});
