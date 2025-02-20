import { Follow } from "@prisma/client";

interface FollowMock extends Follow {
  follower: {
    id_usuario: string;
    nome: string;
    username: string;
    email: string;
    senha: string;
  };
  following: {
    id_usuario: string;
    nome: string;
    username: string;
    email: string;
    senha: string;
  };
}

export class FollowMockBuild {
  public static build(params?: Partial<FollowMock>): FollowMock {
    return {
      id_follow: params?.id_follow || "follow-123",
      followerId: params?.followerId || "user-123",
      followingId: params?.followingId || "user-456",
      follower: params?.follower || {
        id_usuario: "user-123",
        nome: "Michele",
        username: "@michele",
        email: "michele@gmail.com",
        senha: "senha123",
      },
      following: params?.following || {
        id_usuario: "user-456",
        nome: "Theo",
        username: "@theo",
        email: "theo@gmail.com",
        senha: "senha123",
      },
    };
  }
}
