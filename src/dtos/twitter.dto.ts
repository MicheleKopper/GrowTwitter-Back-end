import { TweetType } from "@prisma/client";

export interface CreateTwitterDto {
  conteudo: string;
  type: TweetType;
  idUsuario: string;
  idTweetPai: string;
}
