import { UsuarioMock } from "./usuario.mock";

interface TwitterMockParams {
  id_usuario?: string;
  conteudo?: string;
  type?: "Tweet" | "Reply";
}
export class TwitterMock {
  public static build(query?: TwitterMockParams) {
    
    const usuarioMock = UsuarioMock.build(); // Cria um usuário

    return {
      conteudo: query?.conteudo || "Tweet de teste",
      type: query?.type || "Tweet",
      usuario: usuarioMock,
    };
  }
}
