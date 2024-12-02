import { TweetType } from "@prisma/client";

export interface CreateTwitterDto {
  conteudo: string;
  type: TweetType;
  idUsuario: string;
  idTweetPai?: string;
}

export interface QueryFilterTwitterDto {
  conteudo?: string;
  type?: TweetType;
}

export interface UpdateTwitterDto {
  conteudo?: string;
  type?: TweetType;
  idTweetPai?: string;
}
