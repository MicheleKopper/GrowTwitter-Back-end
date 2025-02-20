import { LikeService } from "../../../src/services/like.service";
import { prismaMock } from "../../config/prisma.mock";
import { LikesMock } from "../mocks/like.mock";

describe("Like findOneById", () => {
    const createSut = () => new LikeService();

  it("Deve retornar os likes de um usuário com sucesso", async () => {
    const sut = createSut();
    
    // Criando mock de like
    const likeMock = LikesMock.build({ idUsuario: "user-123", idTweet: "tweet-123" });
    
    // Configurando o retorno do mock
    prismaMock.like.findMany.mockResolvedValue([likeMock]);

    const response = await sut.findOneById("user-123");

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Likes encontrados!");
    expect(response.data).toHaveLength(1);
    expect(response.data[0].id_like).toBe(likeMock.id_like);
  });

  it("Deve retornar erro 404 se não houver likes para o usuário", async () => {
    const sut = createSut();

    // Configurando o retorno do mock
    prismaMock.like.findMany.mockResolvedValue([]); 

    const response = await sut.findOneById("user-123");

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Nenhum like encontrado para este usuário!");
  });

})