<template>
  <div class="myposts-page">
    <!-- Header -->
    <section class="page-header reveal">
      <div class="header-left">
        <div class="header-badges">
          <svg class="crest" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 4l22 8v16c0 14-9 26-22 32C19 54 10 42 10 28V12l22-8z" fill="currentColor" opacity="0.15"/>
            <path d="M32 8l18 7v13c0 12-7 22-18 27-11-5-18-15-18-27V15l18-7z" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M22 30h20M32 20v28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="badge">Área pessoal</span>
          <span class="ribbon">Minha produção</span>
        </div>
        <h1>Meus posts</h1>
        <div class="ornament-line"></div>
        <p>Gerencie suas pesquisas publicadas, edite conteúdo e acompanhe o status.</p>
      </div>
      <router-link to="/criar-post" class="btn btn-primary" id="btn-new-post">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        Nova pesquisa
      </router-link>
    </section>

    <!-- Stats -->
    <div class="stats-row reveal reveal-delay-1" v-if="posts.length > 0">
      <div class="stat-chip">
        <strong>{{ posts.length }}</strong>
        <span>publicações</span>
      </div>
      <div class="stat-chip">
        <strong>{{ areasPublicadas }}</strong>
        <span>áreas</span>
      </div>
    </div>

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
              {{ post.status === 'publica' ? 'Publicada' : post.status }}
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
import type { Pesquisa } from '@/types';

const pesquisaStore = usePesquisaStore();
const carregando = ref(false);
const showDeleteModal = ref(false);
const deleteTargetId = ref('');

// In a real app, this would filter by current user
const posts = computed<Pesquisa[]>(() => pesquisaStore.todasPesquisas.slice(0, 4));

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
};
</script>

<style scoped>
.myposts-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.page-header h1 {
  margin: 0;
}

.page-header p {
  max-width: 420px;
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

  .page-header {
    flex-direction: column;
  }
}
</style>
