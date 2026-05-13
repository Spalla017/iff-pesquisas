// =============================================
// Chat — Tipos para o módulo de chat por colaboração
// =============================================

/** Conversa de grupo vinculada a uma solicitação de colaboração. */
export interface ChatConversa {
  id: string;
  colaboracaoId: string;
  titulo: string;
  participanteIds: string[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

/** Participante de uma conversa de colaboração. */
export interface ChatParticipante {
  conversaId: string;
  colaboracaoId: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioCurso?: string;
  papel: 'autor' | 'interessado';
  joinedAt: Date;
  leftAt?: Date;
  ativo: boolean;
}

/** Mensagem enviada em uma conversa de colaboração. */
export interface ChatMensagem {
  id: string;
  conversaId: string;
  colaboracaoId: string;
  autorId: string;
  autorNome: string;
  conteudo: string;
  createdAt: Date;
  tipo: 'usuario' | 'sistema';
  lida?: boolean;
  lidaPorIds?: string[];
}

/** Resumo de conversa exibido na aba Mensagens. */
export interface ChatConversaResumo {
  conversaId: string;
  colaboracaoId: string;
  titulo: string;
  totalParticipantes: number;
  ultimaMensagem?: string;
  ultimaMensagemAt?: Date;
  naoLidas: number;
}
