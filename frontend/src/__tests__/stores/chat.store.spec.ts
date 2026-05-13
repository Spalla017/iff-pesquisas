import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';

// Mock localStorage
const storage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, val: string) => { storage[key] = val; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
});

const loginAsUser = (id: string, nome: string, email: string, curso = 'Sistemas de Informação') => {
  const authStore = useAuthStore();
  authStore.usuario = { id, nome, email, matricula: '0000', perfil: 'aluno', curso };
  authStore.token = 'test-token';
};

describe('chat.store', () => {
  beforeEach(() => {
    Object.keys(storage).forEach(k => delete storage[k]);
    setActivePinia(createPinia());
  });

  describe('garantirConversaDaColaboracao', () => {
    it('cria conversa ao primeiro interesse', () => {
      const chatStore = useChatStore();
      const conversaId = chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');

      expect(conversaId).toBe('chat-colab-1');
      expect(chatStore.conversas).toHaveLength(1);
      expect(chatStore.conversas[0].colaboracaoId).toBe('colab-1');
      expect(chatStore.conversas[0].titulo).toBe('Projeto X');
    });

    it('não cria conversa duplicada para a mesma colaboração', () => {
      const chatStore = useChatStore();
      const id1 = chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      const id2 = chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');

      expect(id1).toBe(id2);
      expect(chatStore.conversas).toHaveLength(1);
    });

    it('cria conversas separadas para colaborações diferentes', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto A');
      chatStore.garantirConversaDaColaboracao('colab-2', 'Projeto B');

      expect(chatStore.conversas).toHaveLength(2);
    });

    it('adiciona mensagem de sistema quando cria conversa', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');

      expect(chatStore.mensagens).toHaveLength(1);
      expect(chatStore.mensagens[0].tipo).toBe('sistema');
      expect(chatStore.mensagens[0].colaboracaoId).toBe('colab-1');
    });
  });

  describe('adicionarParticipanteNaConversa', () => {
    it('adiciona novo interessado como participante', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');

      const ok = chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br', curso: 'SI',
      }, 'interessado');

      expect(ok).toBe(true);
      expect(chatStore.participantes).toHaveLength(1);
      expect(chatStore.participantes[0].papel).toBe('interessado');
      expect(chatStore.participantes[0].ativo).toBe(true);
    });

    it('não duplica participante já ativo', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });

      expect(chatStore.participantes).toHaveLength(1);
    });

    it('reativa participante inativo', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });

      chatStore.removerParticipanteDaConversa('colab-1', 'user-1');
      expect(chatStore.participantes[0].ativo).toBe(false);

      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });
      expect(chatStore.participantes[0].ativo).toBe(true);
    });

    it('retorna false se conversa não existe', () => {
      const chatStore = useChatStore();
      const ok = chatStore.adicionarParticipanteNaConversa('colab-999', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });
      expect(ok).toBe(false);
    });
  });

  describe('removerParticipanteDaConversa', () => {
    it('desativa participante mantendo histórico', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });

      const ok = chatStore.removerParticipanteDaConversa('colab-1', 'user-1');
      expect(ok).toBe(true);
      expect(chatStore.participantes[0].ativo).toBe(false);
      expect(chatStore.participantes[0].leftAt).toBeDefined();
    });

    it('retorna false se participante não é ativo', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      const ok = chatStore.removerParticipanteDaConversa('colab-1', 'user-inexistente');
      expect(ok).toBe(false);
    });
  });

  describe('enviarMensagem', () => {
    it('envia mensagem válida como participante ativo', async () => {
      const chatStore = useChatStore();
      loginAsUser('user-1', 'João', 'joao@iff.edu.br');

      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });

      const ok = await chatStore.enviarMensagem('colab-1', 'Olá, equipe!');
      expect(ok).toBe(true);

      const msgs = chatStore.mensagens.filter(m => m.tipo === 'usuario');
      expect(msgs).toHaveLength(1);
      expect(msgs[0].conteudo).toBe('Olá, equipe!');
      expect(msgs[0].autorNome).toBe('João');
    });

    it('rejeita mensagem vazia', async () => {
      const chatStore = useChatStore();
      loginAsUser('user-1', 'João', 'joao@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });

      const ok = await chatStore.enviarMensagem('colab-1', '   ');
      expect(ok).toBe(false);
    });

    it('rejeita mensagem de não-participante', async () => {
      const chatStore = useChatStore();
      loginAsUser('user-2', 'Maria', 'maria@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');

      const ok = await chatStore.enviarMensagem('colab-1', 'Intruso!');
      expect(ok).toBe(false);
    });

    it('rejeita mensagem de participante inativo', async () => {
      const chatStore = useChatStore();
      loginAsUser('user-1', 'João', 'joao@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });
      chatStore.removerParticipanteDaConversa('colab-1', 'user-1');

      const ok = await chatStore.enviarMensagem('colab-1', 'Tentando...');
      expect(ok).toBe(false);
    });
  });

  describe('listarMensagensVisiveis', () => {
    it('mostra mensagens para participante ativo', () => {
      const chatStore = useChatStore();
      loginAsUser('user-1', 'João', 'joao@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });

      const msgs = chatStore.listarMensagensVisiveis('colab-1');
      expect(msgs.length).toBeGreaterThan(0); // Mensagens de sistema existem
    });

    it('bloqueia acesso de não-participante', () => {
      const chatStore = useChatStore();
      loginAsUser('user-99', 'Estranho', 'estranho@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');

      const msgs = chatStore.listarMensagensVisiveis('colab-1');
      expect(msgs).toHaveLength(0);
    });
  });

  describe('contarNaoLidas e marcarComoLida', () => {
    it('conta mensagens não lidas corretamente', async () => {
      const chatStore = useChatStore();

      // User 1 envia mensagem
      loginAsUser('user-1', 'João', 'joao@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-2', nome: 'Maria', email: 'maria@iff.edu.br',
      });
      await chatStore.enviarMensagem('colab-1', 'Olá!');

      // User 2 verifica não lidas
      loginAsUser('user-2', 'Maria', 'maria@iff.edu.br');
      expect(chatStore.contarNaoLidas('colab-1')).toBe(1);
    });

    it('marca mensagens como lidas', async () => {
      const chatStore = useChatStore();

      loginAsUser('user-1', 'João', 'joao@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-2', nome: 'Maria', email: 'maria@iff.edu.br',
      });
      await chatStore.enviarMensagem('colab-1', 'Olá!');

      loginAsUser('user-2', 'Maria', 'maria@iff.edu.br');
      chatStore.marcarComoLida('colab-1');
      expect(chatStore.contarNaoLidas('colab-1')).toBe(0);
    });

    it('não marca como lida para outros usuários', async () => {
      const chatStore = useChatStore();

      loginAsUser('user-1', 'João', 'joao@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-2', nome: 'Maria', email: 'maria@iff.edu.br',
      });
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-3', nome: 'Pedro', email: 'pedro@iff.edu.br',
      });

      await chatStore.enviarMensagem('colab-1', 'Olá, time!');

      loginAsUser('user-2', 'Maria', 'maria@iff.edu.br');
      expect(chatStore.contarNaoLidas('colab-1')).toBe(1);
      chatStore.marcarComoLida('colab-1');
      expect(chatStore.contarNaoLidas('colab-1')).toBe(0);

      loginAsUser('user-3', 'Pedro', 'pedro@iff.edu.br');
      expect(chatStore.contarNaoLidas('colab-1')).toBe(1);
    });
  });

  describe('listarConversasDoUsuario', () => {
    it('lista conversa para autor', () => {
      const chatStore = useChatStore();
      loginAsUser('user-autor', 'Autor', 'autor@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-autor', nome: 'Autor', email: 'autor@iff.edu.br',
      }, 'autor');

      const convs = chatStore.listarConversasDoUsuario();
      expect(convs).toHaveLength(1);
      expect(convs[0].titulo).toBe('Projeto X');
    });

    it('lista conversa para interessado', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-int', nome: 'Interessado', email: 'int@iff.edu.br',
      }, 'interessado');

      loginAsUser('user-int', 'Interessado', 'int@iff.edu.br');
      const convs = chatStore.listarConversasDoUsuario();
      expect(convs).toHaveLength(1);
    });

    it('não lista conversa para não-participante', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');

      loginAsUser('user-estranho', 'Estranho', 'estranho@iff.edu.br');
      const convs = chatStore.listarConversasDoUsuario();
      expect(convs).toHaveLength(0);
    });

    it('inclui conversa mesmo sem mensagens de usuário', () => {
      const chatStore = useChatStore();
      loginAsUser('user-1', 'João', 'joao@iff.edu.br');
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto Vazio');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });

      const convs = chatStore.listarConversasDoUsuario();
      expect(convs).toHaveLength(1);
      // A última mensagem será de sistema, não de usuário
    });
  });

  describe('existeConversa', () => {
    it('retorna true se conversa existe', () => {
      const chatStore = useChatStore();
      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      expect(chatStore.existeConversa('colab-1')).toBe(true);
    });

    it('retorna false se conversa não existe', () => {
      const chatStore = useChatStore();
      expect(chatStore.existeConversa('colab-999')).toBe(false);
    });
  });

  describe('removerConversaDaColaboracao', () => {
    it('remove conversa, participantes e mensagens da colaboração', async () => {
      const chatStore = useChatStore();
      loginAsUser('user-1', 'João', 'joao@iff.edu.br');

      chatStore.garantirConversaDaColaboracao('colab-1', 'Projeto X');
      chatStore.adicionarParticipanteNaConversa('colab-1', {
        id: 'user-1', nome: 'João', email: 'joao@iff.edu.br',
      });
      await chatStore.enviarMensagem('colab-1', 'Mensagem de teste');

      const ok = chatStore.removerConversaDaColaboracao('colab-1');
      expect(ok).toBe(true);
      expect(chatStore.existeConversa('colab-1')).toBe(false);
      expect(chatStore.participantes.some(p => p.colaboracaoId === 'colab-1')).toBe(false);
      expect(chatStore.mensagens.some(m => m.colaboracaoId === 'colab-1')).toBe(false);
    });
  });
});
