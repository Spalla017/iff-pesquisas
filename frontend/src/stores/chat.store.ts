import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  ChatConversa,
  ChatParticipante,
  ChatMensagem,
  ChatConversaResumo,
} from '@/types';
import { useAuthStore } from '@/stores/auth.store';

const STORAGE_KEY_CONVERSAS = 'iff-pesquisas:chat:conversas:v1';
const STORAGE_KEY_PARTICIPANTES = 'iff-pesquisas:chat:participantes:v1';
const STORAGE_KEY_MENSAGENS = 'iff-pesquisas:chat:mensagens:v1';

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// ---------------------------------------------------------------------------
// Persistência
// ---------------------------------------------------------------------------

const carregarJSON = <T>(key: string, fallback: T[]): T[] => {
  if (!isBrowser()) return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

const salvarJSON = (key: string, data: unknown) => {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(data));
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useChatStore = defineStore('chat', () => {
  // State
  const conversas = ref<ChatConversa[]>(carregarJSON<ChatConversa>(STORAGE_KEY_CONVERSAS, []));
  const participantes = ref<ChatParticipante[]>(carregarJSON<ChatParticipante>(STORAGE_KEY_PARTICIPANTES, []));
  const mensagens = ref<ChatMensagem[]>(carregarJSON<ChatMensagem>(STORAGE_KEY_MENSAGENS, []));

  // Persistência helpers
  const persistirConversas = () => salvarJSON(STORAGE_KEY_CONVERSAS, conversas.value);
  const persistirParticipantes = () => salvarJSON(STORAGE_KEY_PARTICIPANTES, participantes.value);
  const persistirMensagens = () => salvarJSON(STORAGE_KEY_MENSAGENS, mensagens.value);

  const jaLidaPeloUsuario = (mensagem: ChatMensagem, usuarioId: string): boolean => {
    if (Array.isArray(mensagem.lidaPorIds)) {
      return mensagem.lidaPorIds.includes(usuarioId);
    }

    // Compatibilidade com dados antigos persistidos apenas com `lida`.
    return mensagem.lida === true;
  };

  const marcarLidaPeloUsuario = (mensagem: ChatMensagem, usuarioId: string): boolean => {
    if (jaLidaPeloUsuario(mensagem, usuarioId)) return false;

    if (!Array.isArray(mensagem.lidaPorIds)) {
      mensagem.lidaPorIds = [];
    }

    if (!mensagem.lidaPorIds.includes(usuarioId)) {
      mensagem.lidaPorIds.push(usuarioId);
      return true;
    }

    return false;
  };

  // ---------------------------------------------------------------------------
  // Ações principais
  // ---------------------------------------------------------------------------

  /**
   * Garante que existe uma única conversa para a colaboração.
   * Se já existir, retorna o ID. Se não, cria uma nova.
   * Função idempotente — nunca cria duplicata.
   *
   * @param colaboracaoId - ID da colaboração
   * @param titulo - Título do projeto (usado na criação)
   * @returns ID da conversa
   */
  const garantirConversaDaColaboracao = (colaboracaoId: string, titulo?: string): string => {
    const existente = conversas.value.find(c => c.colaboracaoId === colaboracaoId);
    if (existente) return existente.id;

    const novaConversa: ChatConversa = {
      id: `chat-${colaboracaoId}`,
      colaboracaoId,
      titulo: titulo || `Colaboração ${colaboracaoId}`,
      participanteIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    conversas.value.push(novaConversa);
    persistirConversas();

    // Mensagem de sistema: chat criado
    adicionarMensagemSistema(
      novaConversa.id,
      colaboracaoId,
      'Chat do projeto criado. Os participantes podem conversar aqui.',
    );

    return novaConversa.id;
  };

  /**
   * Adiciona um participante à conversa da colaboração.
   * Se já é participante ativo, não duplica. Se era inativo, reativa.
   *
   * @param colaboracaoId - ID da colaboração
   * @param usuario - Dados do usuário a adicionar
   * @param papel - 'autor' ou 'interessado'
   * @returns `true` se adicionado/reativado com sucesso
   */
  const adicionarParticipanteNaConversa = (
    colaboracaoId: string,
    usuario: { id: string; nome: string; email: string; curso?: string },
    papel: 'autor' | 'interessado' = 'interessado',
  ): boolean => {
    const conversa = conversas.value.find(c => c.colaboracaoId === colaboracaoId);
    if (!conversa) return false;

    // Verificar se já é participante
    const participanteExistente = participantes.value.find(
      p => p.colaboracaoId === colaboracaoId && p.usuarioId === usuario.id,
    );

    if (participanteExistente) {
      if (participanteExistente.ativo) return true; // Já ativo, nada a fazer

      // Reativar participante
      participanteExistente.ativo = true;
      participanteExistente.leftAt = undefined;
      persistirParticipantes();

      // Atualizar lista de IDs na conversa
      if (!conversa.participanteIds.includes(usuario.id)) {
        conversa.participanteIds.push(usuario.id);
        conversa.updatedAt = new Date();
        persistirConversas();
      }

      adicionarMensagemSistema(
        conversa.id,
        colaboracaoId,
        `${usuario.nome} retornou ao chat do projeto.`,
      );
      return true;
    }

    // Novo participante
    const novoParticipante: ChatParticipante = {
      conversaId: conversa.id,
      colaboracaoId,
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      usuarioEmail: usuario.email,
      usuarioCurso: usuario.curso,
      papel,
      joinedAt: new Date(),
      ativo: true,
    };

    participantes.value.push(novoParticipante);
    persistirParticipantes();

    // Atualizar lista na conversa
    if (!conversa.participanteIds.includes(usuario.id)) {
      conversa.participanteIds.push(usuario.id);
      conversa.updatedAt = new Date();
      persistirConversas();
    }

    // Mensagem de sistema
    const acao = papel === 'autor'
      ? `${usuario.nome} criou esta solicitação de colaboração.`
      : `${usuario.nome} demonstrou interesse nesta colaboração.`;
    adicionarMensagemSistema(conversa.id, colaboracaoId, acao);

    return true;
  };

  /**
   * Remove (desativa) um participante da conversa.
   * Mantém mensagens antigas no histórico.
   *
   * @param colaboracaoId - ID da colaboração
   * @param usuarioId - ID do usuário a remover
   * @returns `true` se removido com sucesso
   */
  const removerParticipanteDaConversa = (colaboracaoId: string, usuarioId: string): boolean => {
    const participante = participantes.value.find(
      p => p.colaboracaoId === colaboracaoId && p.usuarioId === usuarioId && p.ativo,
    );
    if (!participante) return false;

    participante.ativo = false;
    participante.leftAt = new Date();
    persistirParticipantes();

    // Remover da lista de IDs da conversa
    const conversa = conversas.value.find(c => c.colaboracaoId === colaboracaoId);
    if (conversa) {
      conversa.participanteIds = conversa.participanteIds.filter(id => id !== usuarioId);
      conversa.updatedAt = new Date();
      persistirConversas();

      adicionarMensagemSistema(
        conversa.id,
        colaboracaoId,
        `${participante.usuarioNome} saiu do chat do projeto.`,
      );
    }

    return true;
  };

  /**
   * Verifica se o usuário atual é participante ativo da conversa.
   */
  const isParticipanteAtivo = (colaboracaoId: string): boolean => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return false;

    return participantes.value.some(
      p => p.colaboracaoId === colaboracaoId && p.usuarioId === usuario.id && p.ativo,
    );
  };

  /**
   * Lista os participantes ativos de uma conversa.
   */
  const participantesAtivos = (colaboracaoId: string): ChatParticipante[] => {
    return participantes.value.filter(
      p => p.colaboracaoId === colaboracaoId && p.ativo,
    );
  };

  // ---------------------------------------------------------------------------
  // Mensagens
  // ---------------------------------------------------------------------------

  /**
   * Adiciona uma mensagem de sistema (não vinculada a nenhum usuário).
   */
  const adicionarMensagemSistema = (
    conversaId: string,
    colaboracaoId: string,
    conteudo: string,
  ) => {
    const msg: ChatMensagem = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      conversaId,
      colaboracaoId,
      autorId: '__sistema__',
      autorNome: 'Sistema',
      conteudo,
      createdAt: new Date(),
      tipo: 'sistema',
      lida: true,
      lidaPorIds: [],
    };
    mensagens.value.push(msg);
    persistirMensagens();

    // Atualizar lastMessageAt na conversa
    const conversa = conversas.value.find(c => c.id === conversaId);
    if (conversa) {
      conversa.lastMessageAt = msg.createdAt;
      conversa.updatedAt = msg.createdAt;
      persistirConversas();
    }
  };

  /**
   * Envia uma mensagem do usuário autenticado na conversa.
   * Valida: autenticação, participação ativa, conteúdo não vazio, tamanho máximo.
   *
   * @param colaboracaoId - ID da colaboração
   * @param conteudo - Texto da mensagem
   * @returns `true` se enviada com sucesso
   */
  const enviarMensagem = async (colaboracaoId: string, conteudo: string): Promise<boolean> => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return false;

    // Validar participação
    if (!isParticipanteAtivo(colaboracaoId)) return false;

    // Validar conteúdo
    const texto = conteudo.trim();
    if (!texto) return false;
    if (texto.length > 2000) return false;

    const conversa = conversas.value.find(c => c.colaboracaoId === colaboracaoId);
    if (!conversa) return false;

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 80));

    const msg: ChatMensagem = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      conversaId: conversa.id,
      colaboracaoId,
      autorId: usuario.id,
      autorNome: usuario.nome,
      conteudo: texto,
      createdAt: new Date(),
      tipo: 'usuario',
      lida: false,
      lidaPorIds: [usuario.id],
    };

    mensagens.value.push(msg);
    persistirMensagens();

    conversa.lastMessageAt = msg.createdAt;
    conversa.updatedAt = msg.createdAt;
    persistirConversas();

    return true;
  };

  /**
   * Lista mensagens visíveis para o usuário autenticado.
   * Mostra apenas mensagens até a data em que o participante saiu (se saiu).
   */
  const listarMensagensVisiveis = (colaboracaoId: string): ChatMensagem[] => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return [];

    const participante = participantes.value.find(
      p => p.colaboracaoId === colaboracaoId && p.usuarioId === usuario.id,
    );
    if (!participante) return [];

    const todasDaConversa = mensagens.value
      .filter(m => m.colaboracaoId === colaboracaoId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Se inativo, mostrar até a data de saída
    if (!participante.ativo && participante.leftAt) {
      const leftTime = new Date(participante.leftAt).getTime();
      return todasDaConversa.filter(m => new Date(m.createdAt).getTime() <= leftTime);
    }

    return todasDaConversa;
  };

  /**
   * Marca todas as mensagens de uma conversa como lidas para o usuário atual.
   */
  const marcarComoLida = (colaboracaoId: string): void => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return;

    let changed = false;
    mensagens.value.forEach(m => {
      if (
        m.colaboracaoId === colaboracaoId &&
        m.autorId !== usuario.id &&
        m.tipo === 'usuario'
      ) {
        const marcou = marcarLidaPeloUsuario(m, usuario.id);
        if (marcou) changed = true;
      }
    });

    if (changed) {
      persistirMensagens();
    }
  };

  /**
   * Conta mensagens não lidas para o usuário atual em uma conversa.
   */
  const contarNaoLidas = (colaboracaoId: string): number => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return 0;

    return mensagens.value.filter(
      m =>
        m.colaboracaoId === colaboracaoId &&
        m.autorId !== usuario.id &&
        m.tipo === 'usuario' &&
        !jaLidaPeloUsuario(m, usuario.id),
    ).length;
  };

  /**
   * Total de mensagens não lidas em todas as conversas do usuário.
   */
  const totalNaoLidas = computed(() => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return 0;

    // Obter colaborações onde o usuário é participante ativo
    const colabIds = participantes.value
      .filter(p => p.usuarioId === usuario.id && p.ativo)
      .map(p => p.colaboracaoId);

    return mensagens.value.filter(
      m =>
        colabIds.includes(m.colaboracaoId) &&
        m.autorId !== usuario.id &&
        m.tipo === 'usuario' &&
        !jaLidaPeloUsuario(m, usuario.id),
    ).length;
  });

  // ---------------------------------------------------------------------------
  // Listagem de conversas
  // ---------------------------------------------------------------------------

  /**
   * Lista conversas do usuário autenticado com resumo.
   * Inclui conversas mesmo sem mensagens (criadas por interesse).
   */
  const listarConversasDoUsuario = (): ChatConversaResumo[] => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return [];

    // Encontrar colaborações onde o usuário é participante ativo
    const participacoesAtivas = participantes.value.filter(
      p => p.usuarioId === usuario.id && p.ativo,
    );

    return participacoesAtivas.map(part => {
      const conversa = conversas.value.find(c => c.colaboracaoId === part.colaboracaoId);
      if (!conversa) return null;

      const msgsDaConversa = mensagens.value
        .filter(m => m.colaboracaoId === part.colaboracaoId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const ultimaMsg = msgsDaConversa[0];
      const naoLidas = contarNaoLidas(part.colaboracaoId);
      const totalParts = participantes.value.filter(
        p => p.colaboracaoId === part.colaboracaoId && p.ativo,
      ).length;

      return {
        conversaId: conversa.id,
        colaboracaoId: part.colaboracaoId,
        titulo: conversa.titulo,
        totalParticipantes: totalParts,
        ultimaMensagem: ultimaMsg?.conteudo,
        ultimaMensagemAt: ultimaMsg?.createdAt ? new Date(ultimaMsg.createdAt) : undefined,
        naoLidas,
      } satisfies ChatConversaResumo;
    }).filter(Boolean) as ChatConversaResumo[];
  };

  /**
   * Verifica se existe conversa para uma colaboração.
   */
  const existeConversa = (colaboracaoId: string): boolean => {
    return conversas.value.some(c => c.colaboracaoId === colaboracaoId);
  };

  /**
   * Remove completamente a conversa e dados relacionados de uma colaboração.
   * Usado quando a colaboração é excluída.
   */
  const removerConversaDaColaboracao = (colaboracaoId: string): boolean => {
    const haviaConversa = conversas.value.some(c => c.colaboracaoId === colaboracaoId);
    const haviaParticipantes = participantes.value.some(p => p.colaboracaoId === colaboracaoId);
    const haviaMensagens = mensagens.value.some(m => m.colaboracaoId === colaboracaoId);

    conversas.value = conversas.value.filter(c => c.colaboracaoId !== colaboracaoId);
    participantes.value = participantes.value.filter(p => p.colaboracaoId !== colaboracaoId);
    mensagens.value = mensagens.value.filter(m => m.colaboracaoId !== colaboracaoId);

    if (haviaConversa) persistirConversas();
    if (haviaParticipantes) persistirParticipantes();
    if (haviaMensagens) persistirMensagens();

    return haviaConversa || haviaParticipantes || haviaMensagens;
  };

  return {
    // State
    conversas,
    participantes,
    mensagens,
    totalNaoLidas,

    // Actions
    garantirConversaDaColaboracao,
    adicionarParticipanteNaConversa,
    removerParticipanteDaConversa,
    isParticipanteAtivo,
    participantesAtivos,
    enviarMensagem,
    listarMensagensVisiveis,
    marcarComoLida,
    contarNaoLidas,
    listarConversasDoUsuario,
    existeConversa,
    removerConversaDaColaboracao,
  };
});
