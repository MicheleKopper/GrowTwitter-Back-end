import { Tweet } from "@prisma/client";
import { QueryFilterTwitterDto } from "../../../src/dtos";
import { TwitterService } from "../../../src/services/twitter.service";
import { prismaMock } from "../../config/prisma.mock";
import { TwitterMock } from "../mocks/twitter.mock";

describe("Twitter findAll", () => {
  const createSut = () => new TwitterService();

  it("Deve retornar todos os tweets", async () => {
    const sut = createSut();

    // Array de tweets mockados
    const tweetsMock = Array.from({ length: 5 }, (_, index) => {
      return TwitterMock.build({
        conteudo: `conteudo${index}`,
        type: "T",
      });
    });

    prismaMock.tweet.findMany.mockResolvedValue(tweetsMock);

    // Ojeto query para busca
    const query: QueryFilterTwitterDto = {
      conteudo: "conteudo",
      type: "T",
    };

    // Act
    const result = await sut.findAll(query);

    // Asserts
    expect(result.ok).toBeTruthy();
    expect(result.code).toBe(200);
    expect(result.message).toBe("Tweets listados com sucesso!");
    expect(result.data).toHaveLength(5);

    result.data.forEach((tweet: Tweet, index: number) => {
      expect(tweet).toEqual(
        expect.objectContaining({
          conteudo: expect.any(String),
          type: "T",
          usuario: expect.objectContaining({
            id_usuario: expect.any(String),
            nome: expect.any(String),
            username: expect.any(String),
          }),
          replies: expect.any(Array),
        })
      );
    });
  });
});
