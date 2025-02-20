import { UsuarioService } from "../../../src/services/usuario.service";
import { prismaMock } from "../../config/prisma.mock";
import { UsuarioMock } from "../mocks/usuario.mock";


describe("Delete user", () => {
  const createSut = () => new UsuarioService();

  it("Deve deletar um usuário com sucesso", async () => {
    const sut = createSut();
    const usuarioMock = UsuarioMock.build();

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
    prismaMock.tweet.deleteMany.mockResolvedValue({ count: 0 });
    prismaMock.usuario.delete.mockResolvedValue(usuarioMock);

    const response = await sut.delete(usuarioMock.id_usuario);

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Usuário deletado com sucesso!");
    expect(response.data).toMatchObject(usuarioMock);
  });

  it("Deve retornar erro 404 se o usuário não for encontrado", async () => {
    const sut = createSut();
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    const response = await sut.delete("id_inexistente");

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Usuario não encontrado!");
  });
});
