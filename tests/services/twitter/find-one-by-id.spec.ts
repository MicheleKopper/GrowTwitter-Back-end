import { TwitterService } from "../../../src/services/twitter.service";
import { prismaMock } from "../../config/prisma.mock";
import { TwitterMock } from "../mocks/twitter.mock";
import { UsuarioMock } from "../mocks/usuario.mock";
import { Tweet, Usuario } from "@prisma/client";

describe("Find one tweet by ID", () => {
  const createSut = () => new TwitterService();

    it("Deve retornar um tweet com o usuário quando um ID válido é fornecido", async () => {
      const sut = createSut();
      const tweetMock = TwitterMock.build(); 

      // Criando o mock do tweet com a estrutura completa, incluindo o usuário com senha
      const tweetPrismaMock: Tweet & { usuario: Usuario } = {
        ...tweetMock,
        usuario: UsuarioMock.build({ senha: "senha123" }), 
      };

      prismaMock.tweet.findUnique.mockResolvedValue(tweetPrismaMock);

      const response = await sut.findOneById(tweetMock.id_tweet);

      expect(response.ok).toBeTruthy();
      expect(response.code).toBe(200);
      expect(response.message).toBe("Tweet encontrado com sucesso!");
      expect(response.data).toMatchObject({
        id_tweet: tweetMock.id_tweet,
        conteudo: tweetMock.conteudo,
        type: tweetMock.type,
        usuario: expect.objectContaining({
          id_usuario: expect.any(String), 
          nome: tweetMock.usuario.nome,
          username: tweetMock.usuario.username,
          email: tweetMock.usuario.email,
          senha: tweetMock.usuario.senha, 
        }),
      });
    });

  it("Deve retornar erro 404 se o tweet não for encontrado", async () => {
    const sut = createSut();
    prismaMock.tweet.findUnique.mockResolvedValue(null);

    const response = await sut.findOneById("id_inexistente");

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Tweet não encontrado!");
  });
});
