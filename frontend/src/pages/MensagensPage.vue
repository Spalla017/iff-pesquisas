<template>
  <div class="mensagens-page">
    <header class="mensagens-page__header">
      <div>
        <h1>Mensagens</h1>
        <p>Converse com participantes das colaboracoes sem sair da plataforma.</p>
      </div>
      <span v-if="conversas.length > 0" class="mensagens-page__badge">
        {{ totalNaoLidas }} nao lida{{ totalNaoLidas === 1 ? '' : 's' }}
      </span>
    </header>

    <div v-if="conversas.length === 0" class="mensagens-page__empty">
      <h2>Sem conversas ativas</h2>
      <p>As conversas aparecem aqui quando houver mensagens em colaboracoes que voce participa.</p>
      <router-link to="/colaboracoes" class="btn btn-outline btn-sm">Explorar colaboracoes</router-link>
    </div>

    <div v-else class="mensagens-page__layout">
      <aside class="mensagens-page__sidebar">
        <button
          v-for="conversa in conversas"
          :key="conversa.colaboracaoId"
          class="mensagens-page__item"
          :class="{ 'mensagens-page__item--active': conversa.colaboracaoId === colaboracaoSelecionadaId }"
          @click="selecionarConversa(conversa.colaboracaoId)"
        >
          <div class="mensagens-page__item-title">
            <strong>{{ conversa.titulo }}</strong>
            <span v-if="conversa.naoLidas > 0" class="mensagens-page__item-counter">
              {{ conversa.naoLidas }}
            </span>
          </div>
          <p v-if="conversa.ultimaMensagem" class="mensagens-page__item-preview">
            {{ conversa.ultimaMensagem.autorNome }}: {{ conversa.ultimaMensagem.conteudo }}
          </p>
          <p v-else class="mensagens-page__item-preview">
            Sem mensagens visiveis para voce.
          </p>
          <div class="mensagens-page__item-meta">
            <span>{{ conversa.participantesAtivos }} participante{{ conversa.participantesAtivos === 1 ? '' : 's' }}</span>
            <span v-if="conversa.ultimaMensagem">{{ formatarDataHora(conversa.ultimaMensagem.createdAt) }}</span>
          </div>
        </button>
      </aside>

      <section class="mensagens-page__thread">
        <div v-if="colaboracaoSelecionada" class="mensagens-page__thread-header">
          <div>
            <h2>{{ colaboracaoSelecionada.titulo }}</h2>
            <p>{{ colaboracaoSelecionada.area }} · {{ colaboracaoSelecionada.status }}</p>
          </div>
          <router-link
            :to="`/colaboracoes/${colaboracaoSelecionada.id}`"
            class="btn btn-outline btn-sm"
          >
            Ver colaboracao
          </router-link>
        </div>

        <ColaboracaoChatPanel
          v-if="colaboracaoSelecionada"
          :colaboracao-id="colaboracaoSelecionada.id"
          :mostrar-cabecalho="false"
        />

        <div v-else class="mensagens-page__thread-empty">
          Selecione uma conversa para abrir o chat.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat.store';
import { useColaboracaoStore } from '@/stores/colaboracao.store';
import ColaboracaoChatPanel from '@/components/common/ColaboracaoChatPanel.vue';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const colaboracaoStore = useColaboracaoStore();

const conversas = computed(() => chatStore.listarConversasDoUsuario());
const totalNaoLidas = computed(() => chatStore.totalNaoLidas);

const colaboracaoSelecionadaId = computed(() => {
  const queryId = typeof route.query.colab === 'string' ? route.query.colab : '';
  if (queryId) return queryId;
  return conversas.value[0]?.colaboracaoId || '';
});

const colaboracaoSelecionada = computed(() =>
  colaboracaoStore.todasColaboracoes.find(colab => colab.id === colaboracaoSelecionadaId.value),
);

const selecionarConversa = (colaboracaoId: string) => {
  if (colaboracaoId === colaboracaoSelecionadaId.value) return;
  router.replace({ path: '/mensagens', query: { colab: colaboracaoId } });
};

const formatarDataHora = (data: Date | string) =>
  new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

watch(
  () => colaboracaoSelecionadaId.value,
  (id) => {
    if (id) {
      chatStore.marcarComoLida(id);
    }
  },
  { immediate: true },
);

watch(
  () => conversas.value,
  (novasConversas) => {
    if (novasConversas.length === 0) return;

    const idAtual = colaboracaoSelecionadaId.value;
    const existeNaLista = novasConversas.some(conversa => conversa.colaboracaoId === idAtual);

    if (!existeNaLista) {
      const primeira = novasConversas[0];
      router.replace({ path: '/mensagens', query: { colab: primeira.colaboracaoId } });
    }
  },
  { immediate: true },
);

onMounted(() => {
  chatStore.limparOrfaos();
});
</script>

<style scoped>
.mensagens-page {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.mensagens-page__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.mensagens-page__header h1 {
  margin: 0;
  font-size: 1.7rem;
}

.mensagens-page__header p {
  margin: 0.4rem 0 0;
  font-size: 0.9rem;
}

.mensagens-page__badge {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
  background: var(--surface);
  font-size: 0.8rem;
  font-weight: 700;
}

.mensagens-page__empty {
  border: 1px dashed var(--border-strong);
  border-radius: 8px;
  background: var(--surface);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  max-width: 520px;
}

.mensagens-page__empty h2 {
  margin: 0;
  font-size: 1.1rem;
}

.mensagens-page__empty p {
  margin: 0;
  font-size: 0.9rem;
}

.mensagens-page__layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 1rem;
  min-height: 520px;
}

.mensagens-page__sidebar {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 640px;
  overflow-y: auto;
}

.mensagens-page__item {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  padding: 0.65rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.mensagens-page__item:hover {
  border-color: var(--primary);
}

.mensagens-page__item--active {
  border-color: var(--primary);
  background: var(--primary-light);
}

.mensagens-page__item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.mensagens-page__item-title strong {
  font-size: 0.86rem;
  color: var(--text);
}

.mensagens-page__item-counter {
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 0.73rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.35rem;
}

.mensagens-page__item-preview {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mensagens-page__item-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  font-size: 0.72rem;
  color: var(--muted);
}

.mensagens-page__thread {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.mensagens-page__thread-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.mensagens-page__thread-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.mensagens-page__thread-header p {
  margin: 0.35rem 0 0;
  font-size: 0.82rem;
}

.mensagens-page__thread-empty {
  border: 1px dashed var(--border-strong);
  border-radius: 8px;
  padding: 1rem;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 980px) {
  .mensagens-page__layout {
    grid-template-columns: 1fr;
  }

  .mensagens-page__sidebar {
    max-height: 280px;
  }
}
</style>
