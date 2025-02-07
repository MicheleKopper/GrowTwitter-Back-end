import { Tweet, TweetType } from "@prisma/client";

interface TweetMock extends Tweet {
  usuario?: {
    id_usuario: string;
    nome: string;
    username: string;
  };
  replies?: TweetMock[];
}

export class TwitterMock {
  public static build(params?: Partial<TweetMock>): TweetMock {
    return {
      id_tweet: params?.id_tweet || "Id-123",
      conteudo: params?.conteudo || "Conteúdo",
      type: params?.type || TweetType.T,
      idUsuario: params?.idUsuario || "Id-123",
      idTweetPai: params?.idTweetPai || null,
      usuario: params?.usuario || {
        id_usuario: "Id-123",
        nome: "Michele",
        username: "@michele",
      },
      replies: params?.replies || [],
    };
  }
}
