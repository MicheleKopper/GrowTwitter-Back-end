export interface CreateLikeDto {
  idUsuario: string;
  idTweet: string;
}

export interface QueryFilterLikeDto {
  idUsuario?: string;
  idTweet?: string;
}