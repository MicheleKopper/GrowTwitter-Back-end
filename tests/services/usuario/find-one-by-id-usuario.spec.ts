import { UsuarioService } from "../../../src/services/usuario.service";
import { prismaMock } from "../../config/prisma.mock";
import { UsuarioMock } from "../mocks/usuario.mock";
import { Usuario, Tweet, Follow } from "@prisma/client"; // Importar os tipos corretos

describe("FindOneById user", () => {
  const createSut = () => new UsuarioService();

  it("Deve retornar um usuário quando um ID válido é fornecido", async () => {
    const sut = createSut();
    const usuarioMock = UsuarioMock.build();

    // Criando um mock do usuário com a estrutura correta
    const usuarioPrismaMock: Usuario & { Tweet: Tweet[]; following: Follow[] } =
      {
        ...usuarioMock,
        Tweet: [], // Garantimos que a propriedade Tweet seja um array vazio no mock
        following: [], // Simulamos um usuário sem seguidores
      };

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioPrismaMock);

    const response = await sut.findOneById(
      usuarioMock.id_usuario,
      "someUserId"
    );

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Usuário encontrado!");
    expect(response.data).toMatchObject({
      id_usuario: usuarioMock.id_usuario,
      nome: usuarioMock.nome,
      username: usuarioMock.username,
      email: usuarioMock.email,
      isFollowing: false, // O usuário logado não está seguindo
    });
  });

  it("Deve retornar erro 404 se o usuário não for encontrado", async () => {
    const sut = createSut();
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    const response = await sut.findOneById("id_inexistente", "someUserId");

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Usuário não encontrado!");
  });
});
