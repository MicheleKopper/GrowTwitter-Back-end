import { Reply } from "@prisma/client"; // Certifique-se de importar o tipo correto
import { randomUUID } from "crypto"; // Para gerar um ID único

// Mock de uma resposta de tweet
export class ReplyMock {
  public static build(params?: Partial<Reply>): Reply {
    return {
      id_reply: params?.id_reply || randomUUID(),
      conteudo: params?.conteudo || "Conteúdo da resposta",
      type: params?.type || "R", // Defina o tipo padrão como "R" ou o que for mais adequado
      idUsuario: params?.idUsuario || "user-id",
      idTweet: params?.idTweet || "tweet-id",
    };
  }
}
