import { UsuarioService } from "../../../src/services/usuario.service";
import { prismaMock } from "../../config/prisma.mock";
import { UsuarioMock } from "../mocks/usuario.mock";
import { UpdateUsuarioDto } from "../../../src/dtos";

describe("Usuario update", () => {
  const createSut = () => new UsuarioService();
  it("Deve atualizar um usuário com sucesso", async () => {
    const sut = createSut();
    const usuarioMock = UsuarioMock.build();
    const updateDto: UpdateUsuarioDto = { nome: "Nome atualizado" };

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
    prismaMock.usuario.update.mockResolvedValue({
      ...usuarioMock,
      ...updateDto,
    });

    const response = await sut.update(usuarioMock.id_usuario, updateDto);

    expect(response.ok).toBeTruthy();
    expect(response.code).toBe(200);
    expect(response.message).toBe("Usuário atualizado com sucesso!");
    expect(response.data.nome).toBe("Nome atualizado");
  });

  it("Deve retornar erro 404 se o usuário não for encontrado", async () => {
    const sut = createSut();
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    const response = await sut.update("id_inexistente", { nome: "Novo Nome" });

    expect(response.ok).toBeFalsy();
    expect(response.code).toBe(404);
    expect(response.message).toBe("Usuário não encontrado!");
  });
});
