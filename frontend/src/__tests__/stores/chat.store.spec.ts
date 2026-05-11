import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/stores/chat.store';
import { useColaboracaoStore } from '@/stores/colaboracao.store';

describe('chat.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('cria conversa de forma lazy no primeiro envio', async () => {
    const authStore = useAuthStore();
    const chatStore = useChatStore();

    await authStore.login({
      email: 'vinicius@iff.edu.br',
      senha: 'senha123',
    });

    expect(chatStore.listarConversasDoUsuario()).toHaveLength(0);

    const ok = await chatStore.enviarMensagem('colab-1', 'Primeira mensagem da conversa');
    expect(ok).toBe(true);
    expect(chatStore.mensagens).toHaveLength(1);
    expect(chatStore.listarConversasDoUsuario()).toHaveLength(1);
    expect(chatStore.listarConversasDoUsuario()[0].colaboracaoId).toBe('colab-1');
  });

  it('bloqueia usuario fora da colaboracao', async () => {
    const authStore = useAuthStore();
    const chatStore = useChatStore();

    await authStore.login({
      email: 'usuario.externo@iff.edu.br',
      senha: 'senha123',
    });

    const ok = await chatStore.enviarMensagem('colab-1', 'Mensagem nao autorizada');
    expect(ok).toBe(false);
    expect(chatStore.erro).toContain('Apenas autor e interessados');
    expect(chatStore.listarMensagensVisiveis('colab-1')).toHaveLength(0);
  });

  it('interessado novo so ve mensagens apos data de interesse', async () => {
    const authStore = useAuthStore();
    const chatStore = useChatStore();
    const colaboracaoStore = useColaboracaoStore();

    await authStore.login({
      email: 'vinicius@iff.edu.br',
      senha: 'senha123',
    });
    await chatStore.enviarMensagem('colab-1', 'Mensagem antiga antes do interesse');
    chatStore.mensagens[0].createdAt = new Date('2026-01-01T00:00:00.000Z');

    await authStore.login({
      email: 'novo.aluno@iff.edu.br',
      senha: 'senha123',
    });
    await colaboracaoStore.demonstrarInteresse('colab-1');

    const visiveisAntes = chatStore.listarMensagensVisiveis('colab-1');
    expect(visiveisAntes).toHaveLength(0);

    await authStore.login({
      email: 'vinicius@iff.edu.br',
      senha: 'senha123',
    });
    await chatStore.enviarMensagem('colab-1', 'Mensagem nova apos interesse');

    await authStore.login({
      email: 'novo.aluno@iff.edu.br',
      senha: 'senha123',
    });
    const visiveisDepois = chatStore.listarMensagensVisiveis('colab-1');
    expect(visiveisDepois).toHaveLength(1);
    expect(visiveisDepois[0].conteudo).toBe('Mensagem nova apos interesse');
  });

  it('conta nao lidas e marca como lida corretamente', async () => {
    const authStore = useAuthStore();
    const chatStore = useChatStore();

    await authStore.login({
      email: 'carlos.braga@iff.edu.br',
      senha: 'senha123',
    });
    await chatStore.enviarMensagem('colab-2', 'Atualizacao do projeto');

    await authStore.login({
      email: 'lucas.pereira@iff.edu.br',
      senha: 'senha123',
    });
    expect(chatStore.contarNaoLidas('colab-2')).toBe(1);

    chatStore.marcarComoLida('colab-2');
    expect(chatStore.contarNaoLidas('colab-2')).toBe(0);

    await authStore.login({
      email: 'carlos.braga@iff.edu.br',
      senha: 'senha123',
    });
    await chatStore.enviarMensagem('colab-2', 'Nova atualizacao');

    await authStore.login({
      email: 'lucas.pereira@iff.edu.br',
      senha: 'senha123',
    });
    expect(chatStore.contarNaoLidas('colab-2')).toBe(1);
  });

  it('remove acesso quando interesse e cancelado', async () => {
    const authStore = useAuthStore();
    const chatStore = useChatStore();
    const colaboracaoStore = useColaboracaoStore();

    await authStore.login({
      email: 'joao.chat@iff.edu.br',
      senha: 'senha123',
    });
    await colaboracaoStore.demonstrarInteresse('colab-3');
    expect(chatStore.obterPermissaoChat('colab-3').podeEnviar).toBe(true);

    await colaboracaoStore.removerInteresse('colab-3');
    expect(chatStore.obterPermissaoChat('colab-3').podeLer).toBe(false);
    expect(chatStore.obterPermissaoChat('colab-3').podeEnviar).toBe(false);
  });

  it('limpa mensagens e leituras orfas apos exclusao de colaboracao', async () => {
    const authStore = useAuthStore();
    const chatStore = useChatStore();
    const colaboracaoStore = useColaboracaoStore();

    await authStore.login({
      email: 'diego.amaral@iff.edu.br',
      senha: 'senha123',
    });

    await chatStore.enviarMensagem('colab-6', 'Mensagem da colaboracao que sera removida');
    expect(chatStore.mensagens.some(mensagem => mensagem.colaboracaoId === 'colab-6')).toBe(true);
    expect(chatStore.leituras.some(leitura => leitura.colaboracaoId === 'colab-6')).toBe(true);

    await colaboracaoStore.deletarColaboracao('colab-6');
    chatStore.limparOrfaos();

    expect(chatStore.mensagens.some(mensagem => mensagem.colaboracaoId === 'colab-6')).toBe(false);
    expect(chatStore.leituras.some(leitura => leitura.colaboracaoId === 'colab-6')).toBe(false);
  });
});
