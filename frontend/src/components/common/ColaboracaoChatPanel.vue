<template>
  <section class="chat-panel" id="colaboracao-chat-panel">
    <header v-if="mostrarCabecalho" class="chat-panel__header">
      <h2 class="chat-panel__title">Chat da colaboracao</h2>
      <router-link
        v-if="isAutenticado"
        :to="`/mensagens?colab=${colaboracaoId}`"
        class="chat-panel__open-link"
      >
        Abrir central
      </router-link>
    </header>

    <div v-if="!permissao.podeLer" class="chat-panel__blocked">
      <p>{{ permissao.motivoBloqueio }}</p>
    </div>

    <template v-else>
      <div class="chat-panel__messages" id="chat-messages-list">
        <div v-if="mensagens.length === 0" class="chat-panel__empty">
          Nenhuma mensagem ainda. Inicie a conversa sobre esta colaboracao.
        </div>

        <article
          v-for="mensagem in mensagens"
          :key="mensagem.id"
          class="chat-panel__message"
          :class="{ 'chat-panel__message--mine': mensagem.autorId === usuario?.id }"
        >
          <header class="chat-panel__message-meta">
            <strong>{{ mensagem.autorNome }}</strong>
            <span>{{ mensagem.autorPerfil }}</span>
            <time>{{ formatarDataHora(mensagem.createdAt) }}</time>
          </header>
          <p>{{ mensagem.conteudo }}</p>
        </article>
      </div>

      <form class="chat-panel__composer" @submit.prevent="enviarMensagem">
        <label class="sr-only" :for="`chat-input-${colaboracaoId}`">Mensagem</label>
        <textarea
          :id="`chat-input-${colaboracaoId}`"
          v-model="conteudo"
          class="form-textarea chat-panel__textarea"
          rows="3"
          maxlength="1000"
          placeholder="Escreva sua mensagem..."
          :disabled="!permissao.podeEnviar || enviando"
        />
        <div class="chat-panel__composer-footer">
          <span class="chat-panel__counter">{{ conteudo.length }}/1000</span>
          <button
            type="submit"
            class="btn btn-primary btn-sm"
            :disabled="!permissao.podeEnviar || enviando || !conteudo.trim()"
          >
            {{ enviando ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
        <p v-if="chatStore.erro" class="form-error">{{ chatStore.erro }}</p>
      </form>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';

const props = withDefaults(
  defineProps<{
    colaboracaoId: string;
    mostrarCabecalho?: boolean;
  }>(),
  {
    mostrarCabecalho: true,
  },
);

const chatStore = useChatStore();
const authStore = useAuthStore();
const conteudo = ref('');
const enviando = ref(false);

const usuario = computed(() => authStore.usuario);
const isAutenticado = computed(() => authStore.isAutenticado);
const permissao = computed(() => chatStore.obterPermissaoChat(props.colaboracaoId));
const mensagens = computed(() => chatStore.listarMensagensVisiveis(props.colaboracaoId));

const formatarDataHora = (data: Date | string) =>
  new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const enviarMensagem = async () => {
  if (!conteudo.value.trim() || enviando.value || !permissao.value.podeEnviar) return;
  enviando.value = true;

  try {
    const ok = await chatStore.enviarMensagem(props.colaboracaoId, conteudo.value);
    if (ok) {
      conteudo.value = '';
    }
  } finally {
    enviando.value = false;
  }
};

const sincronizarLeitura = () => {
  if (permissao.value.podeLer) {
    chatStore.marcarComoLida(props.colaboracaoId);
  }
};

onMounted(sincronizarLeitura);

watch(
  () => props.colaboracaoId,
  () => {
    conteudo.value = '';
    sincronizarLeitura();
  },
);

watch(
  () => mensagens.value.length,
  () => {
    sincronizarLeitura();
  },
);
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 1rem;
}

.chat-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.chat-panel__title {
  margin: 0;
  font-size: 1.05rem;
}

.chat-panel__open-link {
  font-size: 0.84rem;
  font-weight: 600;
}

.chat-panel__blocked {
  border: 1px dashed var(--border-strong);
  background: var(--bg-strong);
  border-radius: 8px;
  padding: 0.8rem;
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.chat-panel__messages {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 0.2rem;
}

.chat-panel__empty {
  border: 1px dashed var(--border-strong);
  border-radius: 8px;
  padding: 0.9rem;
  font-size: 0.85rem;
  color: var(--muted);
}

.chat-panel__message {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  background: var(--surface-2);
}

.chat-panel__message--mine {
  border-color: var(--primary);
  background: var(--primary-light);
}

.chat-panel__message-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: baseline;
  font-size: 0.74rem;
  color: var(--muted);
  margin-bottom: 0.3rem;
}

.chat-panel__message-meta strong {
  color: var(--text);
}

.chat-panel__message p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text);
  white-space: pre-wrap;
}

.chat-panel__composer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-panel__textarea {
  min-height: 84px;
}

.chat-panel__composer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.chat-panel__counter {
  font-size: 0.75rem;
  color: var(--muted);
}
</style>
