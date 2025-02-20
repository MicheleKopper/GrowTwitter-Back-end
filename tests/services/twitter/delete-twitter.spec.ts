

import { TwitterService } from "../../../src/services/twitter.service";
import { prismaMock } from "../../config/prisma.mock";
import { TweetType } from "@prisma/client";

describe("Delete twitter", () => {
  const createSut = () => new TwitterService();

  it("Deve deletar um tweet com sucesso", async () => {
    const sut = createSut();

    const tweetId = "tweet-123";

    // Mock para verificar que o tweet existe
    prismaMock.tweet.findUnique.mockResolvedValue({
      id_tweet: tweetId,
      idUsuario: "user-123",
      conteudo: "Tweet original",
      type: TweetType.T,
      idTweetPai: null,
    });

    // Mock para simular a exclusão do tweet
    prismaMock.tweet.delete.mockResolvedValue({
      id_tweet: tweetId,
      idUsuario: "user-123",
      conteudo: "Tweet original",
      type: TweetType.T,
      idTweetPai: null,
    });

    const result = await sut.delete(tweetId);

    // Verificações
    expect(result.ok).toBe(true); // Espera-se que 'ok' seja verdadeiro
    expect(result.code).toBe(200); // Espera-se o código de sucesso 200
    expect(result.message).toBe("Tweet deletado com sucesso!"); // Mensagem de sucesso
    expect(result.data).toMatchObject({
      id_tweet: tweetId,
      idUsuario: "user-123",
      conteudo: "Tweet original",
      type: TweetType.T,
      idTweetPai: null,
    }); // Verifica se os dados retornados correspondem ao esperado
  });

  it("Deve retornar erro quando o tweet não for encontrado", async () => {
    const sut = createSut();

    const tweetId = "tweet-123";

    // Mock para simular a situação em que o tweet não existe
    prismaMock.tweet.findUnique.mockResolvedValue(null);

    const result = await sut.delete(tweetId);

    // Verificações
    expect(result.ok).toBe(false); // Espera-se que 'ok' seja falso
    expect(result.code).toBe(404); // Espera-se o código de erro 404
    expect(result.message).toBe("Tweet não encontrado!"); // Mensagem de erro
  });
});
