import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Pesquisa, FiltrosPesquisa, CreatePostPayload, UpdatePostPayload } from '@/types';
import { mockPesquisas } from '@/data/mockPesquisas';
import { useAuthStore } from '@/stores/auth.store';

interface BuscarPorIdOptions {
  incluirRascunhos?: boolean;
  usuarioId?: string;
  usuarioEmail?: string;
}

type PesquisaPersistida = Omit<Pesquisa, 'dataPublicacao'> & {
  dataPublicacao: string;
};

const STORAGE_KEY = 'iff-pesquisas:pesquisas:v1';

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const revogarUrlTemporaria = (url?: string) => {
  if (!url || !url.startsWith('blob:')) {
    return;
  }

  if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url);
  }
};

const limparUrlTemporaria = (url?: string) => {
  if (!url || url.startsWith('blob:')) {
    return '';
  }

  return url;
};

const normalizarPesquisa = (pesquisa: Pesquisa | PesquisaPersistida): Pesquisa => ({
  ...pesquisa,
  dataPublicacao: new Date(pesquisa.dataPublicacao),
  pdfUrl: limparUrlTemporaria(pesquisa.pdfUrl),
  imagemUrl: limparUrlTemporaria(pesquisa.imagemUrl),
});

const carregarPesquisasPersistidas = (): Pesquisa[] => {
  if (!isBrowser()) {
    return [...mockPesquisas];
  }

  const bruto = localStorage.getItem(STORAGE_KEY);
  if (!bruto) {
    return [...mockPesquisas];
  }

  try {
    const parsed = JSON.parse(bruto) as PesquisaPersistida[];
    if (!Array.isArray(parsed)) {
      return [...mockPesquisas];
    }
    const persistidas = parsed.map(normalizarPesquisa);
    const idsPersistidos = new Set(persistidas.map(p => p.id));
    const mocksFaltantes = mockPesquisas.filter(p => !idsPersistidos.has(p.id));
    return [...persistidas, ...mocksFaltantes];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [...mockPesquisas];
  }
};

const serializarPesquisa = (pesquisa: Pesquisa): PesquisaPersistida => ({
  ...pesquisa,
  dataPublicacao: new Date(pesquisa.dataPublicacao).toISOString(),
  pdfUrl: limparUrlTemporaria(pesquisa.pdfUrl),
  imagemUrl: limparUrlTemporaria(pesquisa.imagemUrl),
});

const usuarioPodeVerRascunho = (pesquisa: Pesquisa, options: BuscarPorIdOptions) => {
  if (!options.incluirRascunhos || pesquisa.status !== 'rascunho') {
    return false;
  }

  if (pesquisa.autorEmail) {
    return pesquisa.autorEmail === options.usuarioEmail;
  }

  if (pesquisa.autorId) {
    return pesquisa.autorId === options.usuarioId;
  }

  return false;
};

export const usePesquisaStore = defineStore('pesquisa', () => {
  // State
  const todasPesquisas = ref<Pesquisa[]>(carregarPesquisasPersistidas());
  const pesquisaSelecionada = ref<Pesquisa | null>(null);
  const carregando = ref(false);
  const erro = ref<string | null>(null);
  const paginacao = ref({ pagina: 1, limite: 6, total: 0 });
  const filtros = ref<FiltrosPesquisa>({});

  const persistirPesquisas = () => {
    if (!isBrowser()) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(todasPesquisas.value.map(serializarPesquisa)),
    );
  };

  const proximoId = () => {
    const maiorIdNumerico = todasPesquisas.value.reduce((maior, pesquisa) => {
      const idNumerico = Number(pesquisa.id);
      return Number.isFinite(idNumerico) ? Math.max(maior, idNumerico) : maior;
    }, 0);

    return String(maiorIdNumerico + 1);
  };

  // Computed — pesquisas filtradas e paginadas
  const pesquisasFiltradas = computed(() => {
    // Apenas pesquisas públicas aparecem no feed
    let resultado = [...todasPesquisas.value].filter(p => p.status === 'publica');

    // Filtro por area
    if (filtros.value.area) {
      resultado = resultado.filter(p => p.area === filtros.value.area);
    }

    // Filtro por termo (titulo, resumo, palavras-chave)
    if (filtros.value.termo) {
      const termo = filtros.value.termo.toLowerCase();
      resultado = resultado.filter(p =>
        p.titulo.toLowerCase().includes(termo) ||
        p.resumo.toLowerCase().includes(termo) ||
        (p.palavrasChave && p.palavrasChave.some(k => k.toLowerCase().includes(termo)))
      );
    }

    // Filtro por autor
    if (filtros.value.autor) {
      const autor = filtros.value.autor.toLowerCase();
      resultado = resultado.filter(p =>
        p.autor.toLowerCase().includes(autor)
      );
    }

    // Filtro por orientador
    if (filtros.value.orientador) {
      const orientador = filtros.value.orientador.toLowerCase();
      resultado = resultado.filter(p =>
        p.orientador.toLowerCase().includes(orientador)
      );
    }

    // Ordenar por data mais recente
    resultado.sort((a, b) =>
      new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime()
    );

    return resultado;
  });

  const pesquisasPaginadas = computed(() => {
    const inicio = (paginacao.value.pagina - 1) * paginacao.value.limite;
    const fim = inicio + paginacao.value.limite;
    return pesquisasFiltradas.value.slice(inicio, fim);
  });

  const totalPaginas = computed(() =>
    Math.ceil(pesquisasFiltradas.value.length / paginacao.value.limite)
  );

  /**
   * Busca pesquisas aplicando filtros opcionais. Simula delay de rede.
   * Reseta a página para 1 quando novos filtros são aplicados.
   *
   * @param filtrosNovos - Filtros opcionais (area, termo, autor, orientador)
   */
  const buscarPesquisas = async (filtrosNovos?: FiltrosPesquisa) => {
    if (filtrosNovos) {
      filtros.value = {
        ...filtrosNovos,
      };
      paginacao.value.pagina = 1;
    }

    carregando.value = true;
    erro.value = null;

    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 400));
      paginacao.value.total = pesquisasFiltradas.value.length;
    } catch (err: any) {
      erro.value = err.message || 'Erro ao buscar pesquisas';
    } finally {
      carregando.value = false;
    }
  };

  /**
   * Busca uma pesquisa específica por ID. Simula delay de rede.
   * Popula `pesquisaSelecionada` se encontrada.
   *
   * @param id - ID da pesquisa
   */
  const buscarPorId = async (id: string, options: BuscarPorIdOptions = {}) => {
    carregando.value = true;
    erro.value = null;
    pesquisaSelecionada.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const encontrada = todasPesquisas.value.find(p =>
        p.id === id && (p.status === 'publica' || usuarioPodeVerRascunho(p, options)),
      );
      if (encontrada) {
        pesquisaSelecionada.value = encontrada;
      } else {
        erro.value = 'Pesquisa não encontrada';
      }
    } catch (err: any) {
      erro.value = err.message || 'Erro ao buscar pesquisa';
    } finally {
      carregando.value = false;
    }
  };

  /**
   * Cria uma nova pesquisa e a insere no início da lista.
   * Em modo mock, gera URLs temporárias via `URL.createObjectURL`.
   *
   * @param payload - Dados da pesquisa com arquivo PDF e imagem opcionais
   * @returns `true` se criada com sucesso
   */
  const criarPesquisa = async (payload: CreatePostPayload): Promise<boolean> => {
    carregando.value = true;
    erro.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const authStore = useAuthStore();
      const usuario = authStore.usuario;

      const novaPesquisa: Pesquisa = {
        id: proximoId(),
        titulo: payload.titulo,
        resumo: payload.resumo,
        area: payload.area,
        autor: usuario?.nome || 'Você',
        autorId: usuario?.id,
        autorEmail: usuario?.email,
        orientador: payload.orientador,
        dataPublicacao: new Date(),
        pdfUrl: payload.pdf ? URL.createObjectURL(payload.pdf) : '',
        imagemUrl: payload.imagem ? URL.createObjectURL(payload.imagem) : '',
        status: 'publica',
        palavrasChave: payload.palavrasChave,
      };

      todasPesquisas.value.unshift(novaPesquisa);
      persistirPesquisas();
      return true;
    } catch (err: any) {
      erro.value = err.message || 'Erro ao criar pesquisa';
      return false;
    } finally {
      carregando.value = false;
    }
  };

  /**
   * Atualiza uma pesquisa existente. Preserva imagem e PDF quando não alterados.
   *
   * @param id - ID da pesquisa a ser atualizada
   * @param payload - Novos dados, incluindo flag `removerImagem`
   * @returns `true` se atualizada com sucesso
   */
  const atualizarPesquisa = async (id: string, payload: UpdatePostPayload): Promise<boolean> => {
    carregando.value = true;
    erro.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = todasPesquisas.value.findIndex(p => p.id === id);
      if (index < 0) {
        erro.value = 'Pesquisa não encontrada';
        return false;
      }

      const pesquisaAtual = todasPesquisas.value[index];
      if (payload.pdf) {
        revogarUrlTemporaria(pesquisaAtual.pdfUrl);
      }

      if (payload.imagem || payload.removerImagem) {
        revogarUrlTemporaria(pesquisaAtual.imagemUrl);
      }

      const pesquisaAtualizada: Pesquisa = {
        ...pesquisaAtual,
        titulo: payload.titulo,
        resumo: payload.resumo,
        area: payload.area,
        orientador: payload.orientador,
        palavrasChave: payload.palavrasChave,
        pdfUrl: payload.pdf ? URL.createObjectURL(payload.pdf) : pesquisaAtual.pdfUrl,
        imagemUrl: payload.imagem
          ? URL.createObjectURL(payload.imagem)
          : payload.removerImagem
            ? ''
            : pesquisaAtual.imagemUrl,
      };

      todasPesquisas.value.splice(index, 1, pesquisaAtualizada);
      persistirPesquisas();

      if (pesquisaSelecionada.value?.id === id) {
        pesquisaSelecionada.value = pesquisaAtualizada;
      }

      return true;
    } catch (err: any) {
      erro.value = err.message || 'Erro ao atualizar pesquisa';
      return false;
    } finally {
      carregando.value = false;
    }
  };

  /**
   * Remove uma pesquisa da lista pelo ID.
   *
   * @param id - ID da pesquisa a ser removida
   * @returns `true` se removida com sucesso
   */
  const deletarPesquisa = async (id: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const pesquisa = todasPesquisas.value.find(p => p.id === id);
      if (pesquisa) {
        revogarUrlTemporaria(pesquisa.pdfUrl);
        revogarUrlTemporaria(pesquisa.imagemUrl);
      }
      todasPesquisas.value = todasPesquisas.value.filter(p => p.id !== id);
      persistirPesquisas();
      if (pesquisaSelecionada.value?.id === id) {
        pesquisaSelecionada.value = null;
      }
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Alterna o status de uma pesquisa entre 'publica' e 'rascunho'.
   * Pesquisas em rascunho não aparecem no feed público.
   *
   * @param id - ID da pesquisa
   * @returns `true` se o status foi alternado com sucesso
   */
  const alternarStatus = (id: string): boolean => {
    const index = todasPesquisas.value.findIndex(p => p.id === id);
    if (index < 0) return false;

    const novoStatus = todasPesquisas.value[index].status === 'publica' ? 'rascunho' : 'publica';
    todasPesquisas.value[index] = {
      ...todasPesquisas.value[index],
      status: novoStatus,
    };
    persistirPesquisas();

    if (pesquisaSelecionada.value?.id === id) {
      pesquisaSelecionada.value = todasPesquisas.value[index];
    }

    return true;
  };

  /**
   * Limpa todos os filtros ativos e reseta a página para 1.
   */
  const resetarFiltros = () => {
    filtros.value = {};
    paginacao.value.pagina = 1;
  };

  // Mudar pagina
  const irParaPagina = (pagina: number) => {
    const ultimaPagina = Math.max(1, totalPaginas.value);
    paginacao.value.pagina = Math.min(Math.max(1, pagina), ultimaPagina);
  };

  return {
    todasPesquisas,
    pesquisasFiltradas,
    pesquisasPaginadas,
    pesquisaSelecionada,
    carregando,
    erro,
    paginacao,
    filtros,
    totalPaginas,
    buscarPesquisas,
    buscarPorId,
    criarPesquisa,
    atualizarPesquisa,
    deletarPesquisa,
    alternarStatus,
    resetarFiltros,
    irParaPagina,
  };
});
