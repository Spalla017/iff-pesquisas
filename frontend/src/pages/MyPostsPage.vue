<template>
  <div class="myposts-page">
    <!-- Header -->
    <section class="page-header reveal">
      <div class="header-left">
        <div class="workspace-label">
          <span class="workspace-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 4h9l5 5v11H5z"/>
              <path d="M14 4v5h5"/>
              <path d="M8 13h8"/>
              <path d="M8 17h5"/>
            </svg>
          </span>
          <div>
            <span>Área pessoal</span>
            <strong>Gestão de publicações</strong>
          </div>
        </div>
        <h1>Meus posts</h1>
        <p>Gerencie suas pesquisas publicadas, edite conteúdo e acompanhe o status.</p>
      </div>
      <div class="header-panel">
        <div class="header-metrics" v-if="posts.length > 0">
          <div class="metric-item">
            <strong>{{ posts.length }}</strong>
            <span>publicações</span>
          </div>
          <div class="metric-item">
            <strong>{{ areasPublicadas }}</strong>
            <span>áreas</span>
          </div>
        </div>
        <router-link to="/criar-post" class="btn btn-primary" id="btn-new-post">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Nova pesquisa
        </router-link>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="muted">Carregando seus posts...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="posts.length === 0" class="empty-state reveal reveal-delay-1">
      <div class="empty-state-icon">📝</div>
      <h3>Nenhuma pesquisa publicada</h3>
      <p class="muted">Comece compartilhando seu primeiro trabalho com a comunidade.</p>
      <router-link to="/criar-post" class="btn btn-primary" id="btn-first-post">
        Publicar minha primeira pesquisa
      </router-link>
    </div>

    <!-- Posts List -->
    <div v-else class="posts-list reveal reveal-delay-1">
      <div v-for="post in posts" :key="post.id" class="post-item card card-interactive">
        <div class="post-main">
          <div class="post-tags">
            <span class="pill pill-area">{{ post.area }}</span>
            <span class="pill">{{ formatarData(post.dataPublicacao) }}</span>
            <span
              class="badge"
              :class="post.status === 'publica' ? 'badge-success' : 'badge-warning'"
            >
              {{ post.status === 'publica' ? 'Publicada' : 'Rascunho' }}
            </span>
          </div>
          <h3 class="post-title">{{ post.titulo }}</h3>
          <p class="post-resumo">{{ post.resumo }}</p>
          <div class="post-keywords" v-if="post.palavrasChave?.length">
            <span v-for="kw in post.palavrasChave.slice(0, 3)" :key="kw" class="keyword">{{ kw }}</span>
          </div>
        </div>
        <div class="post-actions">
          <router-link :to="`/pesquisa/${post.id}`" class="btn btn-outline btn-sm" :id="`btn-view-${post.id}`">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Ver
          </router-link>
          <router-link :to="`/editar-post/${post.id}`" class="btn btn-outline btn-sm" :id="`btn-edit-${post.id}`">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg>
            Editar
          </router-link>
          <button
            @click="handleToggleStatus(post.id, post.status)"
            class="btn btn-sm"
            :class="post.status === 'publica' ? 'btn-outline' : 'btn-success'"
            :id="`btn-toggle-${post.id}`"
            :title="post.status === 'publica' ? 'Despublicar esta pesquisa' : 'Publicar esta pesquisa'"
          >
            <svg v-if="post.status === 'publica'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {{ post.status === 'publica' ? 'Despublicar' : 'Publicar' }}
          </button>
          <button @click="handleDelete(post.id)" class="btn btn-danger btn-sm" :id="`btn-delete-${post.id}`">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay fade-in" @click.self="showDeleteModal = false">
        <div class="modal-card scale-in">
          <div class="modal-icon">⚠️</div>
          <h3>Confirmar exclusão</h3>
          <p>Tem certeza que deseja excluir esta pesquisa? Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button @click="confirmarDelete" class="btn btn-danger" id="btn-confirm-delete">
              Sim, excluir
            </button>
            <button @click="showDeleteModal = false" class="btn btn-outline" id="btn-cancel-delete">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePesquisaStore } from '@/stores/pesquisa.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import type { Pesquisa } from '@/types';

const pesquisaStore = usePesquisaStore();
const authStore = useAuthStore();
const toastStore = useToastStore();
const carregando = ref(false);
const showDeleteModal = ref(false);
const deleteTargetId = ref('');

const posts = computed<Pesquisa[]>(() => {
  const usuario = authStore.usuario;
  if (!usuario) {
    return [];
  }

  return pesquisaStore.todasPesquisas
    .filter(post => post.autorEmail === usuario.email || post.autorId === usuario.id)
    .sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime());
});

const areasPublicadas = computed(() => {
  const areasSet = new Set(posts.value.map(p => p.area));
  return areasSet.size;
});

onMounted(() => {
  carregando.value = false;
});

const formatarData = (data: Date) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const handleDelete = (id: string) => {
  deleteTargetId.value = id;
  showDeleteModal.value = true;
};

const confirmarDelete = async () => {
  await pesquisaStore.deletarPesquisa(deleteTargetId.value);
  showDeleteModal.value = false;
  deleteTargetId.value = '';
  toastStore.notificar('Pesquisa excluída com sucesso.', 'success');
};

const handleToggleStatus = (id: string, statusAtual: string) => {
  const sucesso = pesquisaStore.alternarStatus(id);
  if (sucesso) {
    const novoStatus = statusAtual === 'publica' ? 'rascunho' : 'publica';
    toastStore.notificar(
      novoStatus === 'publica'
        ? 'Pesquisa publicada no feed.'
        : 'Pesquisa removida do feed (rascunho).',
      novoStatus === 'publica' ? 'success' : 'warning',
    );
  }
};
</script>

<style scoped>
.myposts-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background:
    linear-gradient(135deg, rgba(18, 71, 52, 0.08), rgba(15, 118, 110, 0.04)),
    var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.workspace-label {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  width: fit-content;
  padding: 0.45rem 0.7rem 0.45rem 0.45rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
}

.workspace-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: var(--primary);
  background: var(--primary-light);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.workspace-label div {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.workspace-label span {
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.workspace-label strong {
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 800;
}

.page-header h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
}

.page-header p {
  max-width: 420px;
  margin: 0;
}

.header-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
  min-width: 220px;
}

.header-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.metric-item {
  display: grid;
  place-items: center;
  min-height: 74px;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-align: center;
}

.metric-item strong {
  color: var(--primary);
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1;
}

.metric-item span {
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 700;
}

.header-panel .btn {
  width: 100%;
}

/* Stats */
.stats-row {
  display: flex;
  gap: 0.75rem;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
}

.stat-chip strong {
  color: var(--primary);
  font-family: var(--font-display);
}

.stat-chip span {
  color: var(--muted);
}

/* Posts List */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
}

.post-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.post-tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  align-items: center;
}

.pill-area {
  background: rgba(28, 47, 99, 0.10);
  color: var(--primary);
}

.post-title {
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.3;
}

.post-resumo {
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-keywords {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.keyword {
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--accent-light);
  color: var(--accent-2);
  font-weight: 600;
}

/* Post Actions */
.post-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-icon {
  font-size: 2rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .page-header {
    grid-template-columns: 1fr;
    padding: 1.25rem;
  }

  .header-panel {
    width: 100%;
    min-width: 0;
  }

  .post-item {
    flex-direction: column;
  }

  .post-actions {
    flex-direction: row;
    width: 100%;
  }

  .post-actions .btn {
    flex: 1;
  }
}
</style>
