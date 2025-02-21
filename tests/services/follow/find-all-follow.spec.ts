import { FollowService } from "../../../src/services/follow.service";
import { prismaMock } from "../../config/prisma.mock";
import { FollowMockBuild } from "../mocks/follow.mock";

describe("Followers findAll", () => {
  const createSut = () => new FollowService();
  
  it("Deve listar seguidores corretamente", async () => {
    const sut = createSut();
    const followMock = FollowMockBuild.build();
    prismaMock.follow.findMany.mockResolvedValue([followMock]);

    const response = await sut.findAllFollowers({ id_usuario: "user-456" });

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Seguidores listados com sucesso!");
    expect(response.data).toHaveLength(1);
    expect(response.data[0]).toMatchObject(followMock.follower);
  });

  it("Deve retornar erro se o ID do usuário não for informado", async () => {
    const sut = createSut();
    const response = await sut.findAllFollowers({ id_usuario: "" });

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(400);
    expect(response.message).toBe("ID do usuário é obrigatório!");
  });
});
