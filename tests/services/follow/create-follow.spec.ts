import { FollowService } from "../../../src/services/follow.service";
import { FollowMockBuild } from "../mocks/follow.mock";
import { prismaMock } from "../../config/prisma.mock";

describe("Follow create", () => {
  const createSut = () => new FollowService();

  it("Deve seguir um usuário com sucesso quando não houver conflito", async () => {
    const sut = createSut();

    // Criando mock de follow
    const followMock = FollowMockBuild.build({
      followerId: "user-123",
      followingId: "user-456",
    });

    // Configurando o retorno do mock
    prismaMock.follow.findFirst.mockResolvedValue(null); // Não existe follow existente
    prismaMock.follow.create.mockResolvedValue({
      id_follow: "follow-123",
      followerId: followMock.followerId,
      followingId: followMock.followingId,
    }); // Mock de criação de follow

    const response = await sut.create({
      followerId: followMock.followerId,
      followingId: followMock.followingId,
    });

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(201);
    expect(response.message).toBe("Agora você está seguindo este usuário!");
  });

  it("Deve retornar erro 409 se o usuário já estiver seguindo o outro", async () => {
    const sut = createSut();

    // Criando mock de follow
    const followMock = FollowMockBuild.build({
      followerId: "user-123",
      followingId: "user-456",
    });

    // Configurando o retorno do mock
    prismaMock.follow.findFirst.mockResolvedValue(followMock); // Já existe follow

    const response = await sut.create({
      followerId: followMock.followerId,
      followingId: followMock.followingId,
    });

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(409);
    expect(response.message).toBe("Você já está seguindo este usuário!");
  });

  it("Deve retornar erro 409 se o usuário tentar seguir a si mesmo", async () => {
    const sut = createSut();

    // Criando mock de follow
    const followMock = FollowMockBuild.build({
      followerId: "user-123",
      followingId: "user-123",
    });

    const response = await sut.create({
      followerId: followMock.followerId,
      followingId: followMock.followingId,
    });

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(409);
    expect(response.message).toBe("Você não pode seguir a si mesmo!");
  });

});
