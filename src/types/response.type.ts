// types: Armazena definições de tipos TypeScript personalizados, ajudando a manter a tipagem em todo o projeto.

export interface ResponseApi {
  ok: boolean;
  code: number;
  message: string;
  data?: any;
}
