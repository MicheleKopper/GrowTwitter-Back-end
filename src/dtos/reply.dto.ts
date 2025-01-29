import { TweetType } from "@prisma/client";

export interface CreateReplyDto {
  conteudo: string;
  type: TweetType;
  idUsuario: string;
  idTweet: string
}