import { Like, Tweet } from "@prisma/client";

interface LikeMock extends Like {
  usuario: {
    id_usuario: string;
    nome: string;
    username: string;
    email: string;
    senha: string;
  };
  tweet: Tweet;
}

export class LikesMock {
  public static build(params?: Partial<LikeMock>): LikeMock {
    return {
      id_like: params?.id_like || "like-123",
      idUsuario: params?.idUsuario || "user-123",
      idTweet: params?.idTweet || "tweet-123",
      usuario: params?.usuario || {
        id_usuario: "user-123",
        nome: "Michele",
        username: "@michele",
        email: "michele@gmail.com",
        senha: "senha123",
      },
      tweet: params?.tweet || {
        id_tweet: "tweet-123",
        idUsuario: "user-123",
        conteudo: "Conteúdo do tweet",
        type: "T", // Pode ser um tipo de tweet, como T = Tweet
        idTweetPai: null,
      },
    };
  }
}
