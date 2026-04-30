import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Pesquisa, FiltrosPesquisa, CreatePostPayload } from '@/types';
import { mockPesquisas } from '@/data/mockPesquisas';

export const usePesquisaStore = defineStore('pesquisa', () => {
  // State
  const todasPesquisas = ref<Pesquisa[]>([...mockPesquisas]);
  const pesquisaSelecionada = ref<Pesquisa | null>(null);
  const carregando = ref(false);
  const erro = ref<string | null>(null);
  const paginacao = ref({ pagina: 1, limite: 6, total: 0 });
  const filtros = ref<FiltrosPesquisa>({});

  // Computed — pesquisas filtradas e paginadas
  const pesquisasFiltradas = computed(() => {
    let resultado = [...todasPesquisas.value];

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

  // Buscar pesquisas (simulado com delay)
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

  // Buscar por ID
  const buscarPorId = async (id: string) => {
    carregando.value = true;
    erro.value = null;
    pesquisaSelecionada.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const encontrada = todasPesquisas.value.find(p => p.id === id);
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

  // Criar pesquisa
  const criarPesquisa = async (payload: CreatePostPayload): Promise<boolean> => {
    carregando.value = true;
    erro.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const novaPesquisa: Pesquisa = {
        id: String(todasPesquisas.value.length + 1),
        titulo: payload.titulo,
        resumo: payload.resumo,
        area: payload.area,
        autor: 'Você',
        orientador: payload.orientador,
        dataPublicacao: new Date(),
        pdfUrl: payload.pdf ? '#' : '',
        imagemUrl: payload.imagem ? URL.createObjectURL(payload.imagem) : '',
        status: 'publica',
        palavrasChave: payload.palavrasChave,
      };

      todasPesquisas.value.unshift(novaPesquisa);
      return true;
    } catch (err: any) {
      erro.value = err.message || 'Erro ao criar pesquisa';
      return false;
    } finally {
      carregando.value = false;
    }
  };

  // Deletar pesquisa
  const deletarPesquisa = async (id: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      todasPesquisas.value = todasPesquisas.value.filter(p => p.id !== id);
      if (pesquisaSelecionada.value?.id === id) {
        pesquisaSelecionada.value = null;
      }
      return true;
    } catch {
      return false;
    }
  };

  // Resetar filtros
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
    deletarPesquisa,
    resetarFiltros,
    irParaPagina,
  };
});
