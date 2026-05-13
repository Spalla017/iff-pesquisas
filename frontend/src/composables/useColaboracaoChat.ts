import { useColaboracaoStore } from '@/stores/colaboracao.store';
import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { useRouter } from 'vue-router';

/**
 * Composable que orquestra a integração entre colaboração e chat.
 * Evita dependência circular entre colaboracao.store e chat.store,
 * centralizando a lógica de interesse + criação/adição ao chat.
 */
export const useColaboracaoChat = () => {
  const colaboracaoStore = useColaboracaoStore();
  const chatStore = useChatStore();
  const authStore = useAuthStore();
  const toastStore = useToastStore();
  const router = useRouter();

  /**
   * Demonstra interesse e garante participação no chat do projeto.
   *
   * @param colaboracaoId - ID da colaboração
   * @returns `true` se o interesse foi registrado com sucesso
   */
  const demonstrarInteresseComChat = async (colaboracaoId: string): Promise<boolean> => {
    const usuario = authStore.usuario;
    if (!usuario) return false;

    // Buscar dados da colaboração para o título
    const colaboracao = colaboracaoStore.todasColaboracoes.find(c => c.id === colaboracaoId);
    if (!colaboracao) return false;

    // Registrar interesse na colaboração
    const ok = await colaboracaoStore.demonstrarInteresse(colaboracaoId);
    if (!ok) return false;

    // Garantir que a conversa existe
    chatStore.garantirConversaDaColaboracao(colaboracaoId, colaboracao.titulo);

    // Adicionar o autor da colaboração como participante (idempotente)
    chatStore.adicionarParticipanteNaConversa(
      colaboracaoId,
      {
        id: colaboracao.autorId,
        nome: colaboracao.autor,
        email: colaboracao.autorEmail,
        curso: colaboracao.cursoOrigem,
      },
      'autor',
    );

    // Adicionar o interessado como participante
    chatStore.adicionarParticipanteNaConversa(
      colaboracaoId,
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        curso: usuario.curso,
      },
      'interessado',
    );

    const isFirstInterest = colaboracao.interessados.length <= 1;
    toastStore.notificar(
      isFirstInterest
        ? 'Interesse registrado. O chat do projeto foi criado.'
        : 'Interesse registrado. Você foi adicionado ao chat do projeto.',
      'success',
    );

    return true;
  };

  /**
   * Remove interesse e desativa participação no chat.
   *
   * @param colaboracaoId - ID da colaboração
   * @returns `true` se o interesse foi removido com sucesso
   */
  const removerInteresseComChat = async (colaboracaoId: string): Promise<boolean> => {
    const usuario = authStore.usuario;
    if (!usuario) return false;

    const ok = await colaboracaoStore.removerInteresse(colaboracaoId);
    if (!ok) return false;

    // Desativar participação no chat (manter histórico)
    chatStore.removerParticipanteDaConversa(colaboracaoId, usuario.id);

    toastStore.notificar('Interesse removido. Você saiu do chat do projeto.', 'info');
    return true;
  };

  /**
   * Navega para a aba de mensagens filtrando pela colaboração.
   */
  const abrirChatDaColaboracao = (colaboracaoId: string) => {
    router.push(`/mensagens?colab=${colaboracaoId}`);
  };

  return {
    demonstrarInteresseComChat,
    removerInteresseComChat,
    abrirChatDaColaboracao,
  };
};
