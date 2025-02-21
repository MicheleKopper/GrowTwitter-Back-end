import { FollowService } from "../../../src/services/follow.service";
import { prismaMock } from "../../config/prisma.mock";
import { FollowMockBuild } from "../mocks/follow.mock";

describe("Follow delete", () => {
  const createSut = () => new FollowService();

  it("Deve excluir um seguidor com sucesso", async () => {
    const sut = createSut();
    const followMock = FollowMockBuild.build();

    prismaMock.follow.findUnique.mockResolvedValue(followMock);
    prismaMock.follow.delete.mockResolvedValue(followMock);

    const response = await sut.delete(followMock.id_follow);

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Seguidor deletado com sucesso!");
  });

  it("Deve retornar erro ao tentar excluir um seguidor inexistente", async () => {
    const sut = createSut();

    prismaMock.follow.findUnique.mockResolvedValue(null); // Não encontrado

    const response = await sut.delete("follow-123");

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Você não esta seguindo este usuário!");
  });
});
