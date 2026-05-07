/** Usuário autenticado na plataforma IFF Pesquisas. */
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  perfil: 'aluno' | 'professor' | 'coordenador';
  curso?: string;
}

/** Pesquisa/post acadêmico publicado na plataforma. */
export interface Pesquisa {
  id: string;
  titulo: string;
  resumo: string;
  area: string;
  autor: string;
  autorId?: string;
  autorEmail?: string;
  orientador: string;
  dataPublicacao: Date;
  pdfUrl?: string;
  imagemUrl?: string;
  status: 'publica' | 'privada' | 'rascunho';
  palavrasChave?: string[];
}

/** Envelope padrão de resposta da API. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/** Filtros aplicáveis à busca de pesquisas no feed. */
export interface FiltrosPesquisa {
  area?: string;
  autor?: string;
  orientador?: string;
  termo?: string;
  pagina?: number;
  limite?: number;
}

/** Credenciais para login institucional. */
export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

/** Progresso de upload de arquivo (PDF/imagem). */
export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

/** Dados necessários para criação de nova pesquisa. */
export interface CreatePostPayload {
  titulo: string;
  resumo: string;
  area: string;
  orientador: string;
  palavrasChave: string[];
  pdf?: File | null;
  imagem?: File | null;
}

/** Dados para atualização de pesquisa existente, com flag opcional para remoção de imagem. */
export interface UpdatePostPayload extends CreatePostPayload {
  removerImagem?: boolean;
}

// =============================================
// Colaboração entre Cursos
// =============================================

/** Cursos disponíveis no IFF Campus Itaperuna. */
export type CursoIFF =
  | 'Sistemas de Informação'
  | 'Administração'
  | 'Mecânica'
  | 'Automação Industrial'
  | 'Eletrotécnica';

/** Status de uma solicitação de colaboração. */
export type StatusColaboracao = 'aberta' | 'em_andamento' | 'concluida' | 'cancelada';

/** Nível de urgência da solicitação. */
export type UrgenciaColaboracao = 'baixa' | 'media' | 'alta';

/** Aluno que demonstrou interesse em colaborar. */
export interface InteresseColaboracao {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioCurso: string;
  usuarioEmail: string;
  dataInteresse: Date;
}

/** Solicitação de colaboração entre cursos. */
export interface Colaboracao {
  id: string;
  titulo: string;
  descricao: string;
  cursoOrigem: string;
  cursosDesejados: string[];
  autor: string;
  autorId: string;
  autorEmail: string;
  orientador: string;
  area: string;
  urgencia: UrgenciaColaboracao;
  status: StatusColaboracao;
  dataCriacao: Date;
  dataAtualizacao: Date;
  competenciasNecessarias: string[];
  interessados: InteresseColaboracao[];
  imagemUrl?: string;
}

/** Filtros aplicáveis à busca de colaborações. */
export interface FiltrosColaboracao {
  cursoDesejado?: string;
  cursoOrigem?: string;
  area?: string;
  status?: StatusColaboracao;
  urgencia?: UrgenciaColaboracao;
  termo?: string;
}

/** Dados necessários para criação de nova solicitação de colaboração. */
export interface CreateColaboracaoPayload {
  titulo: string;
  descricao: string;
  cursosDesejados: string[];
  orientador: string;
  area: string;
  urgencia: UrgenciaColaboracao;
  competenciasNecessarias: string[];
  imagem?: File | null;
}
