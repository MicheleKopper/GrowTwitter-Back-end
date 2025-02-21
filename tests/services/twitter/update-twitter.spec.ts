import { TwitterService } from "../../../src/services/twitter.service";
import { prismaMock } from "../../config/prisma.mock"; // Certifique-se de importar corretamente
import { TweetType } from "@prisma/client";

// Criação do SUT (System Under Test)
describe("Twitter update", () => {
  const createSut = () => new TwitterService();

  it("Deve atualizar um tweet com sucesso", async () => {
    const sut = createSut();

    const tweetId = "tweet-123";
    const updateMock = {
      conteudo: "Tweet atualizado",
      type: TweetType.T,
      idTweetPai: null,
    };

    // Mock da função 'findUnique' para garantir que o tweet existe
    prismaMock.tweet.findUnique.mockResolvedValue({
      id_tweet: tweetId,
      idUsuario: "user-123",
      conteudo: "Tweet original",
      type: TweetType.T,
      idTweetPai: null,
    });

    // Mock da função 'update' do Prisma para retornar um valor simulado
    prismaMock.tweet.update.mockResolvedValue({
      id_tweet: tweetId,
      idUsuario: "user-123",
      conteudo: updateMock.conteudo,
      type: updateMock.type,
      idTweetPai: updateMock.idTweetPai,
    });

    // Chamando o método 'update' do TwitterService
    const result = await sut.update(tweetId, updateMock);

    // Verificações
    expect(result.ok).toBe(true);
    expect(result.code).toBe(200);
    expect(result.message).toBe("Tweet atualizado com sucesso!");
    expect(result.data).toMatchObject({
      id_tweet: tweetId,
      idUsuario: "user-123",
      conteudo: updateMock.conteudo,
      type: updateMock.type,
      idTweetPai: updateMock.idTweetPai,
    });
  });
});
