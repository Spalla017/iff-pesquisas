import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  ChatConversaResumo,
  ChatLeituraUsuario,
  ChatMensagem,
  Colaboracao,
  PermissaoChat,
  Usuario,
} from '@/types';
import { chatMensagemSchema, extrairErroZod } from '@/schemas';
import { useAuthStore } from '@/stores/auth.store';
import { useColaboracaoStore } from '@/stores/colaboracao.store';

type ChatMensagemPersistida = Omit<ChatMensagem, 'createdAt'> & {
  createdAt: string;
};

type ChatLeituraPersistida = Omit<ChatLeituraUsuario, 'lastReadAt'> & {
  lastReadAt: string;
};

const STORAGE_MESSAGES_KEY = 'iff-pesquisas:chat:mensagens:v1';
const STORAGE_READS_KEY = 'iff-pesquisas:chat:leituras:v1';

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const carregarMensagensPersistidas = (): ChatMensagem[] => {
  if (!isBrowser()) return [];

  const bruto = localStorage.getItem(STORAGE_MESSAGES_KEY);
  if (!bruto) return [];

  try {
    const parsed = JSON.parse(bruto) as ChatMensagemPersistida[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(mensagem => ({
      ...mensagem,
      createdAt: new Date(mensagem.createdAt),
    }));
  } catch {
    localStorage.removeItem(STORAGE_MESSAGES_KEY);
    return [];
  }
};

const carregarLeiturasPersistidas = (): ChatLeituraUsuario[] => {
  if (!isBrowser()) return [];

  const bruto = localStorage.getItem(STORAGE_READS_KEY);
  if (!bruto) return [];

  try {
    const parsed = JSON.parse(bruto) as ChatLeituraPersistida[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(leitura => ({
      ...leitura,
      lastReadAt: new Date(leitura.lastReadAt),
    }));
  } catch {
    localStorage.removeItem(STORAGE_READS_KEY);
    return [];
  }
};

const serializarMensagem = (mensagem: ChatMensagem): ChatMensagemPersistida => ({
  ...mensagem,
  createdAt: mensagem.createdAt.toISOString(),
});

const serializarLeitura = (leitura: ChatLeituraUsuario): ChatLeituraPersistida => ({
  ...leitura,
  lastReadAt: leitura.lastReadAt.toISOString(),
});

const ordenarPorDataAsc = (a: { createdAt: Date }, b: { createdAt: Date }) =>
  a.createdAt.getTime() - b.createdAt.getTime();

const ordenarPorDataDesc = (a: { createdAt: Date }, b: { createdAt: Date }) =>
  b.createdAt.getTime() - a.createdAt.getTime();

export const useChatStore = defineStore('chat', () => {
  const mensagens = ref<ChatMensagem[]>(carregarMensagensPersistidas());
  const leituras = ref<ChatLeituraUsuario[]>(carregarLeiturasPersistidas());
  const erro = ref<string | null>(null);
  const carregando = ref(false);

  const persistirMensagens = () => {
    if (!isBrowser()) return;
    localStorage.setItem(
      STORAGE_MESSAGES_KEY,
      JSON.stringify(mensagens.value.map(serializarMensagem)),
    );
  };

  const persistirLeituras = () => {
    if (!isBrowser()) return;
    localStorage.setItem(
      STORAGE_READS_KEY,
      JSON.stringify(leituras.value.map(serializarLeitura)),
    );
  };

  const proximoIdMensagem = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const obterUsuarioAtual = (): Usuario | null => {
    const authStore = useAuthStore();
    return authStore.usuario;
  };

  const obterColaboracao = (colaboracaoId: string): Colaboracao | undefined => {
    const colaboracaoStore = useColaboracaoStore();
    return colaboracaoStore.todasColaboracoes.find(colab => colab.id === colaboracaoId);
  };

  const usuarioEhAutor = (colaboracao: Colaboracao, usuario: Usuario) =>
    colaboracao.autorId === usuario.id || colaboracao.autorEmail === usuario.email;

  const obterInteresseAtivoMaisRecente = (colaboracao: Colaboracao, usuario: Usuario) => {
    const interessesDoUsuario = colaboracao.interessados
      .filter(
        interesse =>
          interesse.usuarioId === usuario.id || interesse.usuarioEmail === usuario.email,
      )
      .sort((a, b) => b.dataInteresse.getTime() - a.dataInteresse.getTime());

    return interessesDoUsuario[0];
  };

  const obterPermissaoChat = (colaboracaoId: string): PermissaoChat => {
    const usuario = obterUsuarioAtual();
    if (!usuario) {
      return {
        podeLer: false,
        podeEnviar: false,
        motivoBloqueio: 'Faca login para acessar o chat.',
      };
    }

    const colaboracao = obterColaboracao(colaboracaoId);
    if (!colaboracao) {
      return {
        podeLer: false,
        podeEnviar: false,
        motivoBloqueio: 'Colaboracao nao encontrada.',
      };
    }

    if (usuarioEhAutor(colaboracao, usuario)) {
      return { podeLer: true, podeEnviar: true };
    }

    const interesse = obterInteresseAtivoMaisRecente(colaboracao, usuario);
    if (interesse) {
      return { podeLer: true, podeEnviar: true };
    }

    return {
      podeLer: false,
      podeEnviar: false,
      motivoBloqueio: 'Apenas autor e interessados podem participar desta conversa.',
    };
  };

  const dataInicioVisibilidade = (
    colaboracaoId: string,
    usuario: Usuario,
  ): Date | null => {
    const colaboracao = obterColaboracao(colaboracaoId);
    if (!colaboracao) return null;
    if (usuarioEhAutor(colaboracao, usuario)) return null;

    const interesse = obterInteresseAtivoMaisRecente(colaboracao, usuario);
    return interesse ? new Date(interesse.dataInteresse) : null;
  };

  const listarMensagensVisiveis = (colaboracaoId: string): ChatMensagem[] => {
    const permissao = obterPermissaoChat(colaboracaoId);
    if (!permissao.podeLer) return [];

    const usuario = obterUsuarioAtual();
    if (!usuario) return [];

    const todasDaColaboracao = mensagens.value
      .filter(mensagem => mensagem.colaboracaoId === colaboracaoId)
      .sort(ordenarPorDataAsc);

    const inicio = dataInicioVisibilidade(colaboracaoId, usuario);
    if (!inicio) {
      return todasDaColaboracao;
    }

    return todasDaColaboracao.filter(
      mensagem => mensagem.createdAt.getTime() >= inicio.getTime(),
    );
  };

  const leituraAtual = (colaboracaoId: string, usuarioId: string) =>
    leituras.value.find(
      leitura =>
        leitura.colaboracaoId === colaboracaoId && leitura.usuarioId === usuarioId,
    );

  const marcarComoLida = (colaboracaoId: string) => {
    const usuario = obterUsuarioAtual();
    if (!usuario) return;

    const permissao = obterPermissaoChat(colaboracaoId);
    if (!permissao.podeLer) return;

    const visiveis = listarMensagensVisiveis(colaboracaoId);
    const ultimaVisivel = visiveis[visiveis.length - 1];
    const referencia = ultimaVisivel?.createdAt ?? new Date();
    const existente = leituraAtual(colaboracaoId, usuario.id);

    if (existente) {
      existente.lastReadAt = new Date(referencia);
    } else {
      leituras.value.push({
        colaboracaoId,
        usuarioId: usuario.id,
        lastReadAt: new Date(referencia),
      });
    }

    persistirLeituras();
  };

  const contarNaoLidas = (colaboracaoId: string): number => {
    const usuario = obterUsuarioAtual();
    if (!usuario) return 0;

    const permissao = obterPermissaoChat(colaboracaoId);
    if (!permissao.podeLer) return 0;

    const visiveis = listarMensagensVisiveis(colaboracaoId).filter(
      mensagem => mensagem.autorId !== usuario.id,
    );
    if (visiveis.length === 0) return 0;

    const leitura = leituraAtual(colaboracaoId, usuario.id);
    if (!leitura) return visiveis.length;

    return visiveis.filter(
      mensagem => mensagem.createdAt.getTime() > leitura.lastReadAt.getTime(),
    ).length;
  };

  const enviarMensagem = async (
    colaboracaoId: string,
    conteudo: string,
  ): Promise<boolean> => {
    carregando.value = true;
    erro.value = null;

    try {
      const permissao = obterPermissaoChat(colaboracaoId);
      if (!permissao.podeEnviar) {
        erro.value = permissao.motivoBloqueio || 'Voce nao pode enviar mensagens.';
        return false;
      }

      const usuario = obterUsuarioAtual();
      if (!usuario) {
        erro.value = 'Faca login para enviar mensagens.';
        return false;
      }

      const validacao = chatMensagemSchema.safeParse({ conteudo });
      if (!validacao.success) {
        erro.value = extrairErroZod(validacao);
        return false;
      }

      const novaMensagem: ChatMensagem = {
        id: proximoIdMensagem(),
        colaboracaoId,
        autorId: usuario.id,
        autorNome: usuario.nome,
        autorPerfil: usuario.perfil,
        conteudo: validacao.data.conteudo,
        createdAt: new Date(),
      };

      mensagens.value.push(novaMensagem);
      mensagens.value.sort(ordenarPorDataAsc);
      persistirMensagens();
      marcarComoLida(colaboracaoId);
      return true;
    } catch (err: any) {
      erro.value = err.message || 'Erro ao enviar mensagem.';
      return false;
    } finally {
      carregando.value = false;
    }
  };

  const listarConversasDoUsuario = (): ChatConversaResumo[] => {
    const usuario = obterUsuarioAtual();
    if (!usuario) return [];

    const colaboracaoStore = useColaboracaoStore();
    const colabsPorId = new Map(
      colaboracaoStore.todasColaboracoes.map(colab => [colab.id, colab]),
    );
    const idsComMensagens = Array.from(
      new Set(mensagens.value.map(mensagem => mensagem.colaboracaoId)),
    );

    return idsComMensagens
      .map((colaboracaoId): ChatConversaResumo | null => {
        const colaboracao = colabsPorId.get(colaboracaoId);
        if (!colaboracao) return null;

        const permissao = obterPermissaoChat(colaboracaoId);
        if (!permissao.podeLer) return null;

        const visiveis = listarMensagensVisiveis(colaboracaoId);
        const ultimaMensagem = visiveis[visiveis.length - 1];

        return {
          colaboracaoId,
          titulo: colaboracao.titulo,
          ultimaMensagem,
          naoLidas: contarNaoLidas(colaboracaoId),
          participantesAtivos: 1 + colaboracao.interessados.length,
        };
      })
      .filter((conversa): conversa is ChatConversaResumo => !!conversa)
      .sort((a, b) => {
        const dataA = a.ultimaMensagem?.createdAt ?? new Date(0);
        const dataB = b.ultimaMensagem?.createdAt ?? new Date(0);
        return ordenarPorDataDesc({ createdAt: dataA }, { createdAt: dataB });
      });
  };

  const limparOrfaos = () => {
    const colaboracaoStore = useColaboracaoStore();
    const idsValidos = new Set(colaboracaoStore.todasColaboracoes.map(c => c.id));

    mensagens.value = mensagens.value.filter(mensagem =>
      idsValidos.has(mensagem.colaboracaoId),
    );
    leituras.value = leituras.value.filter(leitura =>
      idsValidos.has(leitura.colaboracaoId),
    );

    persistirMensagens();
    persistirLeituras();
  };

  const totalNaoLidas = computed(() =>
    listarConversasDoUsuario().reduce((acc, conversa) => acc + conversa.naoLidas, 0),
  );

  limparOrfaos();

  return {
    mensagens,
    leituras,
    erro,
    carregando,
    totalNaoLidas,
    obterPermissaoChat,
    listarConversasDoUsuario,
    listarMensagensVisiveis,
    enviarMensagem,
    marcarComoLida,
    contarNaoLidas,
    limparOrfaos,
  };
});
