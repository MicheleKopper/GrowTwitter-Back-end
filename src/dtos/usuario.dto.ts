// dtos: Armazena Data Transfer Objects (DTOs), que são tipos TypeScript utilizados para definir a estrutura dos dados transferidos entre diferentes camadas da aplicação.

export interface CreateUsuarioDto {
  nome: string;
  username: string;
  email: string;
  senha: string;
  Twitter?: {
    idUsuario: string;
  }[];
}

export interface QueryFilterDto {
  nome?: string;
  username?: string;
  email?: string;
}

export interface UpdateUsuarioDto {
  nome?: string;
  username?: string;
}
