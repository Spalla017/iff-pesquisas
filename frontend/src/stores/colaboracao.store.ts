import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Colaboracao, FiltrosColaboracao, CreateColaboracaoPayload, InteresseColaboracao } from '@/types';
import { mockColaboracoes } from '@/data/mockColaboracoes';
import { useAuthStore } from '@/stores/auth.store';

type ColaboracaoPersistida = Omit<Colaboracao, 'dataCriacao' | 'dataAtualizacao' | 'interessados'> & {
  dataCriacao: string;
  dataAtualizacao: string;
  interessados: (Omit<InteresseColaboracao, 'dataInteresse'> & { dataInteresse: string })[];
};

const STORAGE_KEY = 'iff-pesquisas:colaboracoes:v1';

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const limparUrlTemporaria = (url?: string) => {
  if (!url || url.startsWith('blob:')) return '';
  return url;
};

const normalizarColaboracao = (c: Colaboracao | ColaboracaoPersistida): Colaboracao => ({
  ...c,
  dataCriacao: new Date(c.dataCriacao),
  dataAtualizacao: new Date(c.dataAtualizacao),
  imagemUrl: limparUrlTemporaria(c.imagemUrl),
  interessados: c.interessados.map(i => ({
    ...i,
    dataInteresse: new Date(i.dataInteresse),
  })),
});

const carregarColaboracoesPersistidas = (): Colaboracao[] => {
  if (!isBrowser()) return [...mockColaboracoes];

  const bruto = localStorage.getItem(STORAGE_KEY);
  if (!bruto) return [...mockColaboracoes];

  try {
    const parsed = JSON.parse(bruto) as ColaboracaoPersistida[];
    if (!Array.isArray(parsed)) return [...mockColaboracoes];
    return parsed.map(normalizarColaboracao);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [...mockColaboracoes];
  }
};

const serializarColaboracao = (c: Colaboracao): ColaboracaoPersistida => ({
  ...c,
  dataCriacao: new Date(c.dataCriacao).toISOString(),
  dataAtualizacao: new Date(c.dataAtualizacao).toISOString(),
  imagemUrl: limparUrlTemporaria(c.imagemUrl),
  interessados: c.interessados.map(i => ({
    ...i,
    dataInteresse: new Date(i.dataInteresse).toISOString(),
  })),
});

export const useColaboracaoStore = defineStore('colaboracao', () => {
  // State
  const todasColaboracoes = ref<Colaboracao[]>(carregarColaboracoesPersistidas());
  const colaboracaoSelecionada = ref<Colaboracao | null>(null);
  const carregando = ref(false);
  const erro = ref<string | null>(null);
  const paginacao = ref({ pagina: 1, limite: 6, total: 0 });
  const filtros = ref<FiltrosColaboracao>({});

  const persistirColaboracoes = () => {
    if (!isBrowser()) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(todasColaboracoes.value.map(serializarColaboracao)),
    );
  };

  const proximoId = () => {
    const maiorNumerico = todasColaboracoes.value.reduce((maior, c) => {
      const num = Number(c.id.replace('colab-', ''));
      return Number.isFinite(num) ? Math.max(maior, num) : maior;
    }, 0);
    return `colab-${maiorNumerico + 1}`;
  };

  // Computed — colaborações filtradas e paginadas
  const colaboracoesFiltradas = computed(() => {
    let resultado = [...todasColaboracoes.value];

    // Filtro por curso desejado
    if (filtros.value.cursoDesejado) {
      resultado = resultado.filter(c =>
        c.cursosDesejados.includes(filtros.value.cursoDesejado!),
      );
    }

    // Filtro por curso de origem
    if (filtros.value.cursoOrigem) {
      resultado = resultado.filter(c => c.cursoOrigem === filtros.value.cursoOrigem);
    }

    // Filtro por área
    if (filtros.value.area) {
      resultado = resultado.filter(c => c.area === filtros.value.area);
    }

    // Filtro por status
    if (filtros.value.status) {
      resultado = resultado.filter(c => c.status === filtros.value.status);
    }

    // Filtro por urgência
    if (filtros.value.urgencia) {
      resultado = resultado.filter(c => c.urgencia === filtros.value.urgencia);
    }

    // Filtro por termo (título, descrição, competências)
    if (filtros.value.termo) {
      const termo = filtros.value.termo.toLowerCase();
      resultado = resultado.filter(c =>
        c.titulo.toLowerCase().includes(termo) ||
        c.descricao.toLowerCase().includes(termo) ||
        c.competenciasNecessarias.some(comp => comp.toLowerCase().includes(termo)),
      );
    }

    // Ordenar por data mais recente
    resultado.sort((a, b) =>
      new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
    );

    return resultado;
  });

  const colaboracoesPaginadas = computed(() => {
    const inicio = (paginacao.value.pagina - 1) * paginacao.value.limite;
    const fim = inicio + paginacao.value.limite;
    return colaboracoesFiltradas.value.slice(inicio, fim);
  });

  const totalPaginas = computed(() =>
    Math.ceil(colaboracoesFiltradas.value.length / paginacao.value.limite),
  );

  /**
   * Busca colaborações aplicando filtros opcionais. Simula delay de rede.
   *
   * @param filtrosNovos - Filtros opcionais para a busca
   */
  const buscarColaboracoes = async (filtrosNovos?: FiltrosColaboracao) => {
    if (filtrosNovos) {
      filtros.value = { ...filtrosNovos };
      paginacao.value.pagina = 1;
    }

    carregando.value = true;
    erro.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      paginacao.value.total = colaboracoesFiltradas.value.length;
    } catch (err: any) {
      erro.value = err.message || 'Erro ao buscar colaborações';
    } finally {
      carregando.value = false;
    }
  };

  /**
   * Busca uma colaboração específica por ID.
   *
   * @param id - ID da colaboração
   */
  const buscarPorId = async (id: string) => {
    carregando.value = true;
    erro.value = null;
    colaboracaoSelecionada.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const encontrada = todasColaboracoes.value.find(c => c.id === id);
      if (encontrada) {
        colaboracaoSelecionada.value = encontrada;
      } else {
        erro.value = 'Solicitação de colaboração não encontrada';
      }
    } catch (err: any) {
      erro.value = err.message || 'Erro ao buscar colaboração';
    } finally {
      carregando.value = false;
    }
  };

  /**
   * Cria uma nova solicitação de colaboração.
   *
   * @param payload - Dados da solicitação
   * @returns `true` se criada com sucesso
   */
  const criarColaboracao = async (payload: CreateColaboracaoPayload): Promise<boolean> => {
    carregando.value = true;
    erro.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const authStore = useAuthStore();
      const usuario = authStore.usuario;

      const novaColaboracao: Colaboracao = {
        id: proximoId(),
        titulo: payload.titulo,
        descricao: payload.descricao,
        cursoOrigem: usuario?.curso || 'Sistemas de Informação',
        cursosDesejados: payload.cursosDesejados,
        autor: usuario?.nome || 'Você',
        autorId: usuario?.id || '',
        autorEmail: usuario?.email || '',
        orientador: payload.orientador,
        area: payload.area,
        urgencia: payload.urgencia,
        status: 'aberta',
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        competenciasNecessarias: payload.competenciasNecessarias,
        interessados: [],
        imagemUrl: payload.imagem ? URL.createObjectURL(payload.imagem) : '',
      };

      todasColaboracoes.value.unshift(novaColaboracao);
      persistirColaboracoes();
      return true;
    } catch (err: any) {
      erro.value = err.message || 'Erro ao criar solicitação';
      return false;
    } finally {
      carregando.value = false;
    }
  };

  /**
   * Registra o interesse do usuário logado em uma colaboração.
   *
   * @param colaboracaoId - ID da colaboração
   * @returns `true` se registrado com sucesso
   */
  const demonstrarInteresse = async (colaboracaoId: string): Promise<boolean> => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return false;

    const index = todasColaboracoes.value.findIndex(c => c.id === colaboracaoId);
    if (index < 0) return false;

    const colaboracao = todasColaboracoes.value[index];

    // Não permitir autor demonstrar interesse no próprio projeto
    if (colaboracao.autorEmail === usuario.email || colaboracao.autorId === usuario.id) {
      return false;
    }

    // Verificar se já demonstrou interesse
    const jaInteressado = colaboracao.interessados.some(
      i => i.usuarioEmail === usuario.email || i.usuarioId === usuario.id,
    );
    if (jaInteressado) return false;

    const novoInteresse: InteresseColaboracao = {
      id: `int-${Date.now()}`,
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      usuarioCurso: usuario.curso || 'Não informado',
      usuarioEmail: usuario.email,
      dataInteresse: new Date(),
    };

    todasColaboracoes.value[index] = {
      ...colaboracao,
      interessados: [...colaboracao.interessados, novoInteresse],
      dataAtualizacao: new Date(),
    };

    persistirColaboracoes();

    if (colaboracaoSelecionada.value?.id === colaboracaoId) {
      colaboracaoSelecionada.value = todasColaboracoes.value[index];
    }

    return true;
  };

  /**
   * Remove o interesse do usuário logado de uma colaboração.
   *
   * @param colaboracaoId - ID da colaboração
   * @returns `true` se removido com sucesso
   */
  const removerInteresse = async (colaboracaoId: string): Promise<boolean> => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return false;

    const index = todasColaboracoes.value.findIndex(c => c.id === colaboracaoId);
    if (index < 0) return false;

    const colaboracao = todasColaboracoes.value[index];
    const interessadosFiltrados = colaboracao.interessados.filter(
      i => i.usuarioEmail !== usuario.email && i.usuarioId !== usuario.id,
    );

    todasColaboracoes.value[index] = {
      ...colaboracao,
      interessados: interessadosFiltrados,
      dataAtualizacao: new Date(),
    };

    persistirColaboracoes();

    if (colaboracaoSelecionada.value?.id === colaboracaoId) {
      colaboracaoSelecionada.value = todasColaboracoes.value[index];
    }

    return true;
  };

  /**
   * Atualiza o status de uma colaboração.
   *
   * @param id - ID da colaboração
   * @param novoStatus - Novo status
   * @returns `true` se atualizado com sucesso
   */
  const atualizarStatus = (id: string, novoStatus: Colaboracao['status']): boolean => {
    const index = todasColaboracoes.value.findIndex(c => c.id === id);
    if (index < 0) return false;

    todasColaboracoes.value[index] = {
      ...todasColaboracoes.value[index],
      status: novoStatus,
      dataAtualizacao: new Date(),
    };

    persistirColaboracoes();

    if (colaboracaoSelecionada.value?.id === id) {
      colaboracaoSelecionada.value = todasColaboracoes.value[index];
    }

    return true;
  };

  /**
   * Remove uma colaboração pelo ID.
   *
   * @param id - ID da colaboração
   * @returns `true` se removida com sucesso
   */
  const deletarColaboracao = async (id: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      todasColaboracoes.value = todasColaboracoes.value.filter(c => c.id !== id);
      persistirColaboracoes();
      if (colaboracaoSelecionada.value?.id === id) {
        colaboracaoSelecionada.value = null;
      }
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Limpa todos os filtros ativos e reseta a página para 1.
   */
  const resetarFiltros = () => {
    filtros.value = {};
    paginacao.value.pagina = 1;
  };

  const irParaPagina = (pagina: number) => {
    const ultimaPagina = Math.max(1, totalPaginas.value);
    paginacao.value.pagina = Math.min(Math.max(1, pagina), ultimaPagina);
  };

  /**
   * Verifica se o usuário logado já demonstrou interesse em uma colaboração.
   *
   * @param colaboracaoId - ID da colaboração
   */
  const usuarioJaInteressado = (colaboracaoId: string): boolean => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return false;

    const colaboracao = todasColaboracoes.value.find(c => c.id === colaboracaoId);
    if (!colaboracao) return false;

    return colaboracao.interessados.some(
      i => i.usuarioEmail === usuario.email || i.usuarioId === usuario.id,
    );
  };

  /**
   * Verifica se o usuário logado é o autor da colaboração.
   *
   * @param colaboracaoId - ID da colaboração
   */
  const usuarioEhAutor = (colaboracaoId: string): boolean => {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    if (!usuario) return false;

    const colaboracao = todasColaboracoes.value.find(c => c.id === colaboracaoId);
    if (!colaboracao) return false;

    return colaboracao.autorEmail === usuario.email || colaboracao.autorId === usuario.id;
  };

  return {
    todasColaboracoes,
    colaboracoesFiltradas,
    colaboracoesPaginadas,
    colaboracaoSelecionada,
    carregando,
    erro,
    paginacao,
    filtros,
    totalPaginas,
    buscarColaboracoes,
    buscarPorId,
    criarColaboracao,
    demonstrarInteresse,
    removerInteresse,
    atualizarStatus,
    deletarColaboracao,
    resetarFiltros,
    irParaPagina,
    usuarioJaInteressado,
    usuarioEhAutor,
  };
});
