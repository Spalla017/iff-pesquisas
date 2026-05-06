import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePesquisaStore } from '@/stores/pesquisa.store';

describe('pesquisa.store', () => {
  let store: ReturnType<typeof usePesquisaStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = usePesquisaStore();
  });

  describe('inicializacao', () => {
    it('carrega pesquisas mock ao inicializar', () => {
      expect(store.todasPesquisas.length).toBe(12);
    });
  });

  describe('filtros', () => {
    it('filtra por area corretamente', async () => {
      await store.buscarPesquisas({ area: 'Tecnologia' });
      expect(store.pesquisasFiltradas.every(p => p.area === 'Tecnologia')).toBe(true);
      expect(store.pesquisasFiltradas.length).toBeGreaterThan(0);
    });

    it('filtra por termo no titulo, resumo e palavras-chave', async () => {
      await store.buscarPesquisas({ termo: 'Arduino' });
      expect(store.pesquisasFiltradas.length).toBeGreaterThan(0);
      const encontrou = store.pesquisasFiltradas.some(
        p => p.titulo.toLowerCase().includes('arduino') ||
          p.resumo.toLowerCase().includes('arduino') ||
          (p.palavrasChave?.some(k => k.toLowerCase().includes('arduino')) ?? false),
      );
      expect(encontrou).toBe(true);
    });

    it('filtra por autor sem diferenciar maiusculas', async () => {
      await store.buscarPesquisas({ autor: 'maria' });
      expect(store.pesquisasFiltradas.length).toBeGreaterThan(0);
      expect(
        store.pesquisasFiltradas.every(p => p.autor.toLowerCase().includes('maria')),
      ).toBe(true);
    });

    it('filtra por orientador', async () => {
      await store.buscarPesquisas({ orientador: 'Camila' });
      expect(store.pesquisasFiltradas.length).toBeGreaterThan(0);
      expect(
        store.pesquisasFiltradas.every(p => p.orientador.toLowerCase().includes('camila')),
      ).toBe(true);
    });

    it('filtros combinados retornam intersecao', async () => {
      await store.buscarPesquisas({ area: 'Tecnologia', termo: 'Vue' });
      expect(store.pesquisasFiltradas.length).toBeGreaterThan(0);
      expect(
        store.pesquisasFiltradas.every(p => p.area === 'Tecnologia'),
      ).toBe(true);
    });

    it('resetarFiltros() limpa todos os filtros', async () => {
      await store.buscarPesquisas({ area: 'Saude', termo: 'teste' });
      store.resetarFiltros();
      expect(store.filtros).toEqual({});
      expect(store.paginacao.pagina).toBe(1);
    });
  });

  describe('paginacao', () => {
    it('pagina respeita limite de 6 por pagina', () => {
      expect(store.pesquisasPaginadas.length).toBeLessThanOrEqual(6);
      expect(store.totalPaginas).toBe(Math.ceil(store.pesquisasFiltradas.length / 6));
    });

    it('irParaPagina() muda a pagina atual', () => {
      store.irParaPagina(2);
      expect(store.paginacao.pagina).toBe(2);
    });
  });

  describe('CRUD', () => {
    it('criarPesquisa() adiciona pesquisa no inicio da lista', async () => {
      const totalAntes = store.todasPesquisas.length;

      const sucesso = await store.criarPesquisa({
        titulo: 'Nova pesquisa de teste',
        resumo: 'Resumo da nova pesquisa',
        area: 'Tecnologia',
        orientador: 'Prof. Teste',
        palavrasChave: ['teste'],
        pdf: null,
        imagem: null,
      });

      expect(sucesso).toBe(true);
      expect(store.todasPesquisas.length).toBe(totalAntes + 1);
      expect(store.todasPesquisas[0].titulo).toBe('Nova pesquisa de teste');
    });

    it('atualizarPesquisa() modifica pesquisa existente', async () => {
      const id = store.todasPesquisas[0].id;

      const sucesso = await store.atualizarPesquisa(id, {
        titulo: 'Titulo atualizado',
        resumo: 'Resumo atualizado',
        area: 'Educacao',
        orientador: 'Prof. Novo',
        palavrasChave: ['atualizado'],
        pdf: null,
        imagem: null,
      });

      expect(sucesso).toBe(true);
      const atualizada = store.todasPesquisas.find(p => p.id === id);
      expect(atualizada?.titulo).toBe('Titulo atualizado');
    });

    it('atualizarPesquisa() preserva imagemUrl quando imagem nao e alterada', async () => {
      const pesquisa = store.todasPesquisas[0];
      const imagemOriginal = pesquisa.imagemUrl;

      await store.atualizarPesquisa(pesquisa.id, {
        titulo: pesquisa.titulo,
        resumo: pesquisa.resumo,
        area: pesquisa.area,
        orientador: pesquisa.orientador,
        palavrasChave: pesquisa.palavrasChave || [],
        pdf: null,
        imagem: null,
      });

      const atualizada = store.todasPesquisas.find(p => p.id === pesquisa.id);
      expect(atualizada?.imagemUrl).toBe(imagemOriginal);
    });

    it('deletarPesquisa() remove pesquisa da lista', async () => {
      const totalAntes = store.todasPesquisas.length;
      const id = store.todasPesquisas[0].id;

      const sucesso = await store.deletarPesquisa(id);

      expect(sucesso).toBe(true);
      expect(store.todasPesquisas.length).toBe(totalAntes - 1);
      expect(store.todasPesquisas.find(p => p.id === id)).toBeUndefined();
    });
  });

  describe('buscarPorId', () => {
    it('encontra pesquisa publica por ID', async () => {
      await store.buscarPorId('1');
      expect(store.pesquisaSelecionada).not.toBeNull();
      expect(store.pesquisaSelecionada?.id).toBe('1');
    });

    it('define erro quando pesquisa nao e encontrada', async () => {
      await store.buscarPorId('id-inexistente');
      expect(store.pesquisaSelecionada).toBeNull();
      expect(store.erro).toContain('encontrada');
    });

    it('nao retorna rascunho por padrao', async () => {
      const id = store.todasPesquisas[0].id;
      store.alternarStatus(id);

      await store.buscarPorId(id);

      expect(store.pesquisaSelecionada).toBeNull();
      expect(store.erro).toContain('encontrada');
    });

    it('retorna rascunho quando incluirRascunhos e true', async () => {
      const id = store.todasPesquisas[0].id;
      store.alternarStatus(id);

      await store.buscarPorId(id, { incluirRascunhos: true });

      expect(store.pesquisaSelecionada?.id).toBe(id);
      expect(store.pesquisaSelecionada?.status).toBe('rascunho');
    });
  });

  describe('alternarStatus', () => {
    it('alterna status de publica para rascunho', () => {
      const id = store.todasPesquisas[0].id;
      expect(store.todasPesquisas[0].status).toBe('publica');

      const sucesso = store.alternarStatus(id);

      expect(sucesso).toBe(true);
      expect(store.todasPesquisas.find(p => p.id === id)?.status).toBe('rascunho');
    });

    it('alterna status de rascunho para publica', () => {
      const id = store.todasPesquisas[0].id;
      store.alternarStatus(id);
      store.alternarStatus(id);

      expect(store.todasPesquisas.find(p => p.id === id)?.status).toBe('publica');
    });

    it('retorna false para ID inexistente', () => {
      expect(store.alternarStatus('id-invalido')).toBe(false);
    });
  });

  describe('filtro de status publico', () => {
    it('pesquisasFiltradas exclui rascunhos do feed', () => {
      const totalPublicas = store.pesquisasFiltradas.length;
      const id = store.todasPesquisas[0].id;

      store.alternarStatus(id);

      expect(store.pesquisasFiltradas.length).toBe(totalPublicas - 1);
      expect(store.pesquisasFiltradas.find(p => p.id === id)).toBeUndefined();
    });
  });
});
