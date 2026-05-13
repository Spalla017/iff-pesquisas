<template>
  <section class="chat-panel" :aria-label="`Chat do projeto: ${titulo}`">
    <!-- Header -->
    <header class="chat-panel__header">
      <div class="chat-panel__header-info">
        <h3 class="chat-panel__title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Chat do projeto
        </h3>
        <span class="chat-panel__participants">
          {{ participantesAtivosList.length }} participante{{ participantesAtivosList.length !== 1 ? 's' : '' }}
        </span>
      </div>
      <button
        v-if="expanded"
        type="button"
        class="chat-panel__toggle"
        @click="expanded = false"
        aria-label="Minimizar chat"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
      <button
        v-else
        type="button"
        class="chat-panel__toggle"
        @click="expanded = true"
        aria-label="Expandir chat"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
    </header>

    <!-- Body -->
    <div v-show="expanded" class="chat-panel__body">
      <!-- Blocked: not a participant -->
      <div v-if="!isParticipante" class="chat-panel__blocked">
        <p>Você precisa demonstrar interesse para participar do chat.</p>
      </div>

      <!-- Messages -->
      <div v-else ref="messagesRef" class="chat-panel__messages" aria-live="polite">
        <div v-if="mensagensVisiveis.length === 0" class="chat-panel__empty">
          <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
        </div>

        <div
          v-for="msg in mensagensVisiveis"
          :key="msg.id"
          class="chat-msg"
          :class="{
            'chat-msg--sistema': msg.tipo === 'sistema',
            'chat-msg--proprio': msg.autorId === usuarioAtualId,
          }"
        >
          <!-- System message -->
          <template v-if="msg.tipo === 'sistema'">
            <div class="chat-msg__sistema">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              {{ msg.conteudo }}
            </div>
          </template>

          <!-- User message -->
          <template v-else>
            <div class="chat-msg__avatar">{{ msg.autorNome.charAt(0) }}</div>
            <div class="chat-msg__content">
              <div class="chat-msg__header">
                <strong class="chat-msg__nome">{{ msg.autorNome }}</strong>
                <time class="chat-msg__time">{{ formatarHora(msg.createdAt) }}</time>
              </div>
              <p class="chat-msg__text">{{ msg.conteudo }}</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Input -->
      <form
        v-if="isParticipante && isAtivo"
        class="chat-panel__input"
        @submit.prevent="handleEnviar"
      >
        <label for="chat-input" class="sr-only">Mensagem</label>
        <input
          id="chat-input"
          ref="inputRef"
          v-model="novaMensagem"
          type="text"
          class="form-input"
          placeholder="Digite sua mensagem..."
          maxlength="2000"
          autocomplete="off"
          :disabled="enviando"
        />
        <button
          type="submit"
          class="chat-panel__send-btn"
          :disabled="enviando || !novaMensagem.trim()"
          :title="enviando ? 'Enviando...' : 'Enviar mensagem'"
        >
          <span v-if="enviando" class="chat-panel__spinner" />
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          <span class="sr-only">Enviar</span>
        </button>
      </form>

      <!-- Inactive participant notice -->
      <div v-else-if="isParticipante && !isAtivo" class="chat-panel__inactive">
        <p>Você saiu do chat. Demonstre interesse novamente para voltar a participar.</p>
      </div>

      <!-- Error feedback -->
      <p v-if="erroEnvio" class="chat-panel__erro" role="alert" aria-live="assertive">
        {{ erroEnvio }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';

const props = defineProps<{
  colaboracaoId: string;
  titulo?: string;
}>();

const chatStore = useChatStore();
const authStore = useAuthStore();

const expanded = ref(true);
const novaMensagem = ref('');
const enviando = ref(false);
const erroEnvio = ref('');
const messagesRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const usuarioAtualId = computed(() => authStore.usuario?.id || '');
const isParticipante = computed(() => {
  const usuario = authStore.usuario;
  if (!usuario) return false;
  return chatStore.participantes.some(
    p => p.colaboracaoId === props.colaboracaoId && p.usuarioId === usuario.id,
  );
});

const isAtivo = computed(() => chatStore.isParticipanteAtivo(props.colaboracaoId));
const participantesAtivosList = computed(() => chatStore.participantesAtivos(props.colaboracaoId));
const mensagensVisiveis = computed(() => chatStore.listarMensagensVisiveis(props.colaboracaoId));

const formatarHora = (data: Date | string) => {
  const d = new Date(data);
  const hoje = new Date();
  const isHoje = d.toDateString() === hoje.toDateString();
  if (isHoje) {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) +
    ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
  }
};

const handleEnviar = async () => {
  erroEnvio.value = '';

  const texto = novaMensagem.value.trim();
  if (!texto) {
    erroEnvio.value = 'A mensagem não pode estar vazia.';
    return;
  }

  if (texto.length > 2000) {
    erroEnvio.value = 'A mensagem deve ter no máximo 2000 caracteres.';
    return;
  }

  enviando.value = true;

  try {
    const ok = await chatStore.enviarMensagem(props.colaboracaoId, texto);
    if (ok) {
      novaMensagem.value = '';
      await scrollToBottom();
    } else {
      erroEnvio.value = 'Não foi possível enviar a mensagem. Verifique se você é participante ativo.';
    }
  } catch {
    erroEnvio.value = 'Erro ao enviar mensagem. Tente novamente.';
  } finally {
    enviando.value = false;
  }
};

// Marcar como lidas ao abrir/expandir
watch(expanded, (val) => {
  if (val && isAtivo.value) {
    chatStore.marcarComoLida(props.colaboracaoId);
    scrollToBottom();
    nextTick(() => inputRef.value?.focus());
  }
});

// Scroll ao receber novas mensagens
watch(
  () => mensagensVisiveis.value.length,
  () => scrollToBottom(),
);

onMounted(() => {
  if (expanded.value && isAtivo.value) {
    chatStore.marcarComoLida(props.colaboracaoId);
    scrollToBottom();
  }
});
</script>

<style scoped>
.chat-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.chat-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  background: linear-gradient(135deg, var(--primary-light), var(--surface-2));
  border-bottom: 1px solid var(--border);
}

.chat-panel__header-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.chat-panel__title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.92rem;
  font-weight: 700;
  margin: 0;
  color: var(--primary);
}

.chat-panel__participants {
  font-size: 0.75rem;
  color: var(--muted);
  font-weight: 500;
}

.chat-panel__toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  color: var(--muted);
  display: flex;
  transition: all var(--transition-fast);
}

.chat-panel__toggle:hover {
  background: var(--primary-light);
  color: var(--primary);
}

/* Body */
.chat-panel__body {
  display: flex;
  flex-direction: column;
}

.chat-panel__messages {
  max-height: 360px;
  overflow-y: auto;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.chat-panel__empty {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--muted);
  font-size: 0.85rem;
}

.chat-panel__blocked,
.chat-panel__inactive {
  padding: 1.5rem 1rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.85rem;
  background: var(--bg-strong);
}

/* Messages */
.chat-msg {
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
}

.chat-msg--sistema {
  justify-content: center;
}

.chat-msg__sistema {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--muted);
  background: var(--bg-strong);
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-pill);
  font-style: italic;
}

.chat-msg__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: var(--on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.chat-msg--proprio .chat-msg__avatar {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}

.chat-msg__content {
  flex: 1;
  min-width: 0;
}

.chat-msg__header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.15rem;
}

.chat-msg__nome {
  font-size: 0.8rem;
  color: var(--text);
}

.chat-msg--proprio .chat-msg__nome {
  color: var(--accent-2);
}

.chat-msg__time {
  font-size: 0.68rem;
  color: var(--muted);
}

.chat-msg__text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
}

/* Input */
.chat-panel__input {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  background: var(--surface-2);
}

.chat-panel__input .form-input {
  flex: 1;
  font-size: 0.85rem;
  padding: 0.55rem 0.75rem;
  min-height: 38px;
}

.chat-panel__send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--primary);
  color: var(--on-primary);
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.chat-panel__send-btn:hover:not(:disabled) {
  background: var(--primary-2);
}

.chat-panel__send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-panel__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.chat-panel__erro {
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  color: var(--danger);
  margin: 0;
  background: var(--danger-light);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .chat-panel__messages {
    max-height: 280px;
  }
}
</style>
