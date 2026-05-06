import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePesquisaStore } from '@/stores/pesquisa.store';
import { useAuthStore } from '@/stores/auth.store';

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

    it('criarPesquisa() usa o usuario autenticado como autor', async () => {
      const authStore = useAuthStore();
      await authStore.login({
        email: 'ana.teste@iff.edu.br',
        senha: 'senha123',
      });

      await store.criarPesquisa({
        titulo: 'Pesquisa com autoria',
        resumo: 'Resumo da pesquisa com autoria',
        area: 'Tecnologia',
        orientador: 'Prof. Teste',
        palavrasChave: ['autoria'],
        pdf: null,
        imagem: null,
      });

      expect(store.todasPesquisas[0].autor).toBe('Ana Teste');
      expect(store.todasPesquisas[0].autorId).toBe('dev-ana.teste@iff.edu.br');
      expect(store.todasPesquisas[0].autorEmail).toBe('ana.teste@iff.edu.br');
    });

    it('persiste pesquisas criadas no localStorage', async () => {
      await store.criarPesquisa({
        titulo: 'Pesquisa persistida',
        resumo: 'Resumo da pesquisa persistida',
        area: 'Tecnologia',
        orientador: 'Prof. Teste',
        palavrasChave: ['persistencia'],
        pdf: null,
        imagem: null,
      });

      setActivePinia(createPinia());
      const novoStore = usePesquisaStore();

      expect(novoStore.todasPesquisas[0].titulo).toBe('Pesquisa persistida');
      expect(novoStore.todasPesquisas[0].dataPublicacao).toBeInstanceOf(Date);
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

    it('atualizarPesquisa() persiste alteracao depois de reinicializar o store', async () => {
      const id = store.todasPesquisas[0].id;

      await store.atualizarPesquisa(id, {
        titulo: 'Titulo persistido',
        resumo: 'Resumo persistido',
        area: 'Educacao',
        orientador: 'Prof. Novo',
        palavrasChave: ['persistido'],
        pdf: null,
        imagem: null,
      });

      setActivePinia(createPinia());
      const novoStore = usePesquisaStore();

      expect(novoStore.todasPesquisas.find(p => p.id === id)?.titulo).toBe('Titulo persistido');
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

    it('retorna rascunho quando o usuario autenticado e dono', async () => {
      const authStore = useAuthStore();
      await authStore.login({
        email: 'dono.rascunho@iff.edu.br',
        senha: 'senha123',
      });
      await store.criarPesquisa({
        titulo: 'Rascunho do dono',
        resumo: 'Resumo do rascunho do dono',
        area: 'Tecnologia',
        orientador: 'Prof. Dono',
        palavrasChave: [],
        pdf: null,
        imagem: null,
      });
      const id = store.todasPesquisas[0].id;
      store.alternarStatus(id);

      await store.buscarPorId(id, {
        incluirRascunhos: true,
        usuarioId: authStore.usuario?.id,
        usuarioEmail: authStore.usuario?.email,
      });

      expect(store.pesquisaSelecionada?.id).toBe(id);
      expect(store.pesquisaSelecionada?.status).toBe('rascunho');
    });

    it('nao retorna rascunho quando o usuario autenticado nao e dono', async () => {
      const authStore = useAuthStore();
      await authStore.login({
        email: 'dono.rascunho@iff.edu.br',
        senha: 'senha123',
      });
      await store.criarPesquisa({
        titulo: 'Rascunho privado',
        resumo: 'Resumo do rascunho privado',
        area: 'Tecnologia',
        orientador: 'Prof. Dono',
        palavrasChave: [],
        pdf: null,
        imagem: null,
      });
      const id = store.todasPesquisas[0].id;
      store.alternarStatus(id);

      await store.buscarPorId(id, {
        incluirRascunhos: true,
        usuarioId: 'dev-outro.usuario@iff.edu.br',
        usuarioEmail: 'outro.usuario@iff.edu.br',
      });

      expect(store.pesquisaSelecionada).toBeNull();
      expect(store.erro).toContain('encontrada');
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
