// Tipos de Usuario
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  perfil: 'aluno' | 'professor' | 'coordenador';
}

// Tipos de Pesquisa/Post
export interface Pesquisa {
  id: string;
  titulo: string;
  resumo: string;
  area: string;
  autor: string;
  orientador: string;
  dataPublicacao: Date;
  pdfUrl?: string;
  imagemUrl?: string;
  status: 'publica' | 'privada' | 'rascunho';
  palavrasChave?: string[];
}

// Tipos de API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos de Filtros
export interface FiltrosPesquisa {
  area?: string;
  autor?: string;
  orientador?: string;
  termo?: string;
  pagina?: number;
  limite?: number;
}

// Tipos de Autenticacao
export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

// Tipos de Upload
export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

export interface CreatePostPayload {
  titulo: string;
  resumo: string;
  area: string;
  orientador: string;
  palavrasChave: string[];
  pdf?: File | null;
  imagem?: File | null;
}
