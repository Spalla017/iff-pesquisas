import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useColaboracaoStore } from '@/stores/colaboracao.store';

describe('colaboracao.store', () => {
  let store: ReturnType<typeof useColaboracaoStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useColaboracaoStore();
  });

  describe('inicializacao', () => {
    it('carrega colaborações mock ao inicializar', () => {
      expect(store.todasColaboracoes.length).toBeGreaterThan(0);
      expect(store.todasColaboracoes[0].dataCriacao).toBeInstanceOf(Date);
    });
  });

  describe('filtros', () => {
    it('filtra por curso desejado', async () => {
      const cursoDesejado = store.todasColaboracoes[0].cursosDesejados[0];
      await store.buscarColaboracoes({ cursoDesejado });
      expect(store.colaboracoesFiltradas.length).toBeGreaterThan(0);
      expect(
        store.colaboracoesFiltradas.every((c) => c.cursosDesejados.includes(cursoDesejado)),
      ).toBe(true);
    });

    it('filtra por curso de origem', async () => {
      const cursoOrigem = store.todasColaboracoes[0].cursoOrigem;
      await store.buscarColaboracoes({ cursoOrigem });
      expect(store.colaboracoesFiltradas.length).toBeGreaterThan(0);
      expect(
        store.colaboracoesFiltradas.every((c) => c.cursoOrigem === cursoOrigem),
      ).toBe(true);
    });

    it('filtra por área, status e urgência em conjunto', async () => {
      await store.buscarColaboracoes({
        area: 'Engenharia',
        status: 'aberta',
        urgencia: 'media',
      });

      expect(
        store.colaboracoesFiltradas.every((c) =>
          c.area === 'Engenharia' && c.status === 'aberta' && c.urgencia === 'media',
        ),
      ).toBe(true);
    });

    it('filtra por termo no título, descrição e competências', async () => {
      await store.buscarColaboracoes({ termo: 'dashboard' });
      expect(store.colaboracoesFiltradas.length).toBeGreaterThan(0);
      const encontrou = store.colaboracoesFiltradas.some((c) =>
        c.titulo.toLowerCase().includes('dashboard') ||
        c.descricao.toLowerCase().includes('dashboard') ||
        c.competenciasNecessarias.some((k) => k.toLowerCase().includes('dashboard')),
      );
      expect(encontrou).toBe(true);
    });

    it('resetarFiltros() limpa filtros e volta para página 1', async () => {
      await store.buscarColaboracoes({ termo: 'teste', status: 'aberta' });
      store.irParaPagina(2);
      store.resetarFiltros();

      expect(store.filtros).toEqual({});
      expect(store.paginacao.pagina).toBe(1);
    });
  });

  describe('paginacao', () => {
    it('respeita limite padrão de 6 itens por página', () => {
      expect(store.paginacao.limite).toBe(6);
      expect(store.colaboracoesPaginadas.length).toBeLessThanOrEqual(6);
    });

    it('irParaPagina() limita a navegação ao intervalo válido', () => {
      store.irParaPagina(999);
      expect(store.paginacao.pagina).toBeLessThanOrEqual(store.totalPaginas || 1);
      store.irParaPagina(0);
      expect(store.paginacao.pagina).toBe(1);
    });
  });

  describe('CRUD e persistencia', () => {
    it('criarColaboracao() adiciona no início da lista com autor autenticado', async () => {
      const authStore = useAuthStore();
      await authStore.login({ email: 'aluno.colab@iff.edu.br', senha: 'senha123' });
      const totalAntes = store.todasColaboracoes.length;

      const ok = await store.criarColaboracao({
        titulo: 'Nova colaboração de teste',
        descricao: 'Descrição de teste com conteúdo suficiente para validação da store.',
        cursosDesejados: ['Administração'],
        orientador: 'Prof. Teste',
        area: 'Tecnologia',
        urgencia: 'media',
        competenciasNecessarias: ['Gestão'],
        imagem: null,
      });

      expect(ok).toBe(true);
      expect(store.todasColaboracoes.length).toBe(totalAntes + 1);
      expect(store.todasColaboracoes[0].titulo).toBe('Nova colaboração de teste');
      expect(store.todasColaboracoes[0].autorEmail).toBe('aluno.colab@iff.edu.br');
    });

    it('persiste colaborações no localStorage', async () => {
      const authStore = useAuthStore();
      await authStore.login({ email: 'persist.colab@iff.edu.br', senha: 'senha123' });

      await store.criarColaboracao({
        titulo: 'Colaboração persistida',
        descricao: 'Descrição suficiente para persistência e reidratação da store.',
        cursosDesejados: ['Mecânica'],
        orientador: 'Prof. Persistência',
        area: 'Engenharia',
        urgencia: 'alta',
        competenciasNecessarias: ['Projeto mecânico'],
        imagem: null,
      });

      setActivePinia(createPinia());
      const novoStore = useColaboracaoStore();
      expect(novoStore.todasColaboracoes[0].titulo).toBe('Colaboração persistida');
      expect(novoStore.todasColaboracoes[0].dataCriacao).toBeInstanceOf(Date);
    });

    it('atualizarStatus() altera status da colaboração existente', () => {
      const id = store.todasColaboracoes[0].id;
      const ok = store.atualizarStatus(id, 'em_andamento');
      expect(ok).toBe(true);
      expect(store.todasColaboracoes.find((c) => c.id === id)?.status).toBe('em_andamento');
    });

    it('deletarColaboracao() remove item da lista', async () => {
      const totalAntes = store.todasColaboracoes.length;
      const id = store.todasColaboracoes[0].id;
      const ok = await store.deletarColaboracao(id);

      expect(ok).toBe(true);
      expect(store.todasColaboracoes.length).toBe(totalAntes - 1);
      expect(store.todasColaboracoes.find((c) => c.id === id)).toBeUndefined();
    });

    it('deletarColaboracao() remove também os dados de chat vinculados', async () => {
      const chatStore = useChatStore();
      const authStore = useAuthStore();
      const alvo = store.todasColaboracoes[0];

      chatStore.garantirConversaDaColaboracao(alvo.id, alvo.titulo);
      chatStore.adicionarParticipanteNaConversa(alvo.id, {
        id: alvo.autorId,
        nome: alvo.autor,
        email: alvo.autorEmail,
        curso: alvo.cursoOrigem,
      }, 'autor');

      await authStore.login({ email: 'chat.cleanup@iff.edu.br', senha: 'senha123' });
      chatStore.adicionarParticipanteNaConversa(alvo.id, {
        id: authStore.usuario!.id,
        nome: authStore.usuario!.nome,
        email: authStore.usuario!.email,
        curso: authStore.usuario!.curso,
      }, 'interessado');
      await chatStore.enviarMensagem(alvo.id, 'Mensagem antes da exclusão');

      const ok = await store.deletarColaboracao(alvo.id);
      expect(ok).toBe(true);
      expect(chatStore.existeConversa(alvo.id)).toBe(false);
      expect(chatStore.participantes.some((p) => p.colaboracaoId === alvo.id)).toBe(false);
      expect(chatStore.mensagens.some((m) => m.colaboracaoId === alvo.id)).toBe(false);
    });
  });

  describe('interesse', () => {
    it('demonstrarInteresse() adiciona interessado quando usuário está logado e não é autor', async () => {
      const authStore = useAuthStore();
      await authStore.login({ email: 'interessado@iff.edu.br', senha: 'senha123' });
      const alvo = store.todasColaboracoes.find((c) => c.autorEmail !== 'interessado@iff.edu.br');
      expect(alvo).toBeTruthy();

      const ok = await store.demonstrarInteresse(alvo!.id);
      expect(ok).toBe(true);
      expect(store.usuarioJaInteressado(alvo!.id)).toBe(true);
    });

    it('demonstrarInteresse() bloqueia autor no próprio projeto', async () => {
      const alvo = store.todasColaboracoes[0];
      const authStore = useAuthStore();
      await authStore.login({ email: alvo.autorEmail, senha: 'senha123' });

      const ok = await store.demonstrarInteresse(alvo.id);
      expect(ok).toBe(false);
    });

    it('demonstrarInteresse() impede duplicidade', async () => {
      const authStore = useAuthStore();
      await authStore.login({ email: 'dup@iff.edu.br', senha: 'senha123' });
      const alvo = store.todasColaboracoes.find((c) => c.autorEmail !== 'dup@iff.edu.br')!;

      const primeira = await store.demonstrarInteresse(alvo.id);
      const segunda = await store.demonstrarInteresse(alvo.id);

      expect(primeira).toBe(true);
      expect(segunda).toBe(false);
    });

    it('removerInteresse() remove o interesse existente', async () => {
      const authStore = useAuthStore();
      await authStore.login({ email: 'remove@iff.edu.br', senha: 'senha123' });
      const alvo = store.todasColaboracoes.find((c) => c.autorEmail !== 'remove@iff.edu.br')!;

      await store.demonstrarInteresse(alvo.id);
      const ok = await store.removerInteresse(alvo.id);

      expect(ok).toBe(true);
      expect(store.usuarioJaInteressado(alvo.id)).toBe(false);
    });
  });

  describe('buscarPorId e helpers', () => {
    it('buscarPorId() encontra colaboração existente', async () => {
      const id = store.todasColaboracoes[0].id;
      await store.buscarPorId(id);
      expect(store.colaboracaoSelecionada?.id).toBe(id);
      expect(store.erro).toBeNull();
    });

    it('buscarPorId() define erro para id inexistente', async () => {
      await store.buscarPorId('colab-inexistente');
      expect(store.colaboracaoSelecionada).toBeNull();
      expect(store.erro).toContain('não encontrada');
    });

    it('usuarioEhAutor() retorna true para autor logado', async () => {
      const alvo = store.todasColaboracoes[0];
      const authStore = useAuthStore();
      await authStore.login({ email: alvo.autorEmail, senha: 'senha123' });
      expect(store.usuarioEhAutor(alvo.id)).toBe(true);
    });
  });
});
