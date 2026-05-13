<template>
  <div class="mensagens-page">
    <!-- Empty state -->
    <div v-if="conversas.length === 0" class="empty-state reveal reveal-delay-1">
      <div class="empty-state-icon">💬</div>
      <h3>Nenhuma conversa ainda</h3>
      <p class="muted">
        As conversas aparecerão aqui quando você demonstrar interesse ou
        receber interessados em uma colaboração.
      </p>
      <router-link to="/colaboracoes" class="btn btn-primary" id="btn-explorar-colaboracoes">
        Explorar colaborações
      </router-link>
    </div>

    <!-- Conversations list + active chat -->
    <div v-else class="mensagens-page__layout reveal reveal-delay-1">
      <!-- Sidebar: list of conversations -->
      <aside class="mensagens-page__sidebar">
        <div class="mensagens-page__sidebar-header">
          <strong>Projetos ({{ conversas.length }})</strong>
        </div>
        <nav class="mensagens-page__conv-list" aria-label="Lista de conversas">
          <button
            v-for="conv in conversas"
            :key="conv.conversaId"
            class="mensagens-page__conv-item"
            :class="{ 'mensagens-page__conv-item--active': conversaAtiva === conv.colaboracaoId }"
            @click="selecionarConversa(conv.colaboracaoId)"
            :id="`conv-${conv.colaboracaoId}`"
          >
            <div class="mensagens-page__conv-info">
              <strong class="mensagens-page__conv-title">{{ conv.titulo }}</strong>
              <span class="mensagens-page__conv-last" v-if="conv.ultimaMensagem">
                {{ conv.ultimaMensagem.length > 50 ? conv.ultimaMensagem.slice(0, 50) + '…' : conv.ultimaMensagem }}
              </span>
              <span class="mensagens-page__conv-last mensagens-page__conv-last--empty" v-else>
                Sem mensagens ainda
              </span>
            </div>
            <div class="mensagens-page__conv-meta">
              <span class="mensagens-page__conv-parts">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                {{ conv.totalParticipantes }}
              </span>
              <span v-if="conv.naoLidas > 0" class="mensagens-page__conv-unread">
                {{ conv.naoLidas }}
              </span>
            </div>
          </button>
        </nav>
      </aside>

      <!-- Main: active chat -->
      <main class="mensagens-page__main">
        <div v-if="!conversaAtiva" class="mensagens-page__select-prompt">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="opacity:0.3">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <p class="muted">Selecione uma conversa para começar.</p>
        </div>

        <ColaboracaoChatPanel
          v-else
          :colaboracao-id="conversaAtiva"
          :titulo="conversaAtivaTitulo"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from '@/stores/chat.store';
import ColaboracaoChatPanel from '@/components/common/ColaboracaoChatPanel.vue';

const route = useRoute();
const chatStore = useChatStore();

const conversaAtiva = ref<string | null>(null);

const conversas = computed(() => chatStore.listarConversasDoUsuario());

const conversaAtivaTitulo = computed(() => {
  if (!conversaAtiva.value) return '';
  const conv = conversas.value.find(c => c.colaboracaoId === conversaAtiva.value);
  return conv?.titulo || '';
});

const selecionarConversa = (colaboracaoId: string) => {
  conversaAtiva.value = colaboracaoId;
  chatStore.marcarComoLida(colaboracaoId);
};

// Abrir conversa pelo query param
const verificarQueryParam = () => {
  const colab = route.query.colab;
  if (typeof colab === 'string' && colab) {
    conversaAtiva.value = colab;
    chatStore.marcarComoLida(colab);
  }
};

onMounted(verificarQueryParam);
watch(() => route.query.colab, verificarQueryParam);
</script>

<style scoped>
.mensagens-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

/* Layout */
.mensagens-page__layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1rem;
  min-height: 480px;
}

/* Sidebar */
.mensagens-page__sidebar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mensagens-page__sidebar-header {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.88rem;
}

.mensagens-page__conv-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.mensagens-page__conv-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: none;
  border-bottom: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background var(--transition-fast);
  width: 100%;
}

.mensagens-page__conv-item:hover {
  background: var(--surface-hover);
}

.mensagens-page__conv-item--active {
  background: var(--primary-light);
  border-left: 3px solid var(--primary);
}

.mensagens-page__conv-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.mensagens-page__conv-title {
  font-size: 0.85rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mensagens-page__conv-last {
  font-size: 0.75rem;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mensagens-page__conv-last--empty {
  font-style: italic;
}

.mensagens-page__conv-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  flex-shrink: 0;
}

.mensagens-page__conv-parts {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.72rem;
  color: var(--muted);
}

.mensagens-page__conv-unread {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 0.35rem;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 0.68rem;
  font-weight: 700;
}

/* Main */
.mensagens-page__main {
  min-height: 0;
}

.mensagens-page__select-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.75rem;
  padding: 3rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-align: center;
}

@media (max-width: 768px) {
  .mensagens-page__layout {
    grid-template-columns: 1fr;
  }

  .mensagens-page__sidebar {
    max-height: 240px;
  }
}
</style>
