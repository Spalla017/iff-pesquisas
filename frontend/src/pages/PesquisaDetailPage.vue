<template>
  <div v-if="pesquisa" class="detail-page">
    <!-- Back Link -->
    <router-link to="/feed" class="back-link reveal" id="back-to-feed">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Voltar ao feed
    </router-link>

    <!-- Hero -->
    <section class="detail-hero reveal">
      <div class="hero-meta">
        <span class="pill pill-area">{{ pesquisa.area }}</span>
        <span class="pill">{{ formatarData(pesquisa.dataPublicacao) }}</span>
        <span class="badge badge-success" v-if="pesquisa.status === 'publica'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Publicada
        </span>
      </div>
      <h1>{{ pesquisa.titulo }}</h1>
      <div class="hero-authors">
        <div class="author-chip">
          <span class="author-avatar">{{ pesquisa.autor.charAt(0) }}</span>
          <div>
            <strong>{{ pesquisa.autor }}</strong>
            <span class="muted text-sm">Aluno(a)</span>
          </div>
        </div>
        <div class="author-chip">
          <span class="author-avatar orientador">{{ pesquisa.orientador.charAt(0) }}</span>
          <div>
            <strong>{{ pesquisa.orientador }}</strong>
            <span class="muted text-sm">Orientador(a)</span>
          </div>
        </div>
      </div>
      <div class="hero-actions">
        <a v-if="pdfDisponivel" :href="pesquisa.pdfUrl" class="btn btn-primary" target="_blank" id="btn-download-pdf">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Baixar PDF
        </a>
        <span v-else class="btn btn-outline" style="opacity: 0.5; cursor: not-allowed;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          PDF indisponível
        </span>
        <button type="button" class="btn btn-outline" @click="compartilharPesquisa" id="btn-share-research">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/>
          </svg>
          Compartilhar
        </button>
      </div>
    </section>

    <!-- Content Grid -->
    <div class="detail-grid reveal reveal-delay-1">
      <!-- Main Content -->
      <article class="detail-content card">
        <!-- Keywords -->
        <div v-if="pesquisa.palavrasChave?.length" class="keywords-section">
          <h3 class="section-label">Palavras-chave</h3>
          <div class="keywords-list">
            <span v-for="kw in pesquisa.palavrasChave" :key="kw" class="keyword">{{ kw }}</span>
          </div>
        </div>

        <div class="ornament-line"></div>

        <!-- Resumo -->
        <div class="resumo-section">
          <h2>Resumo</h2>
          <p class="resumo-text">{{ pesquisa.resumo }}</p>
        </div>

        <!-- Imagem -->
        <div v-if="pesquisa.imagemUrl" class="image-section">
          <img :src="pesquisa.imagemUrl" :alt="pesquisa.titulo" class="research-image" loading="lazy" />
        </div>
      </article>

      <!-- Sidebar -->
      <aside class="detail-sidebar">
        <!-- Info Card -->
        <div class="card info-card">
          <h3>Detalhes da pesquisa</h3>
          <div class="info-rows">
            <div class="info-row">
              <span class="info-label">Área</span>
              <span class="info-value">{{ pesquisa.area }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Publicação</span>
              <span class="info-value">{{ formatarData(pesquisa.dataPublicacao) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status</span>
              <span class="info-value badge-inline" :class="pesquisa.status === 'publica' ? 'badge-success' : ''">{{ pesquisa.status }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">PDF</span>
              <span class="info-value" :class="pdfDisponivel ? 'text-success' : 'text-muted'">
                {{ pdfDisponivel ? 'Disponível' : 'Não disponível' }}
              </span>
            </div>
          </div>
        </div>

        <!-- CTA Card -->
        <div class="card cta-card">
          <div class="cta-icon">🎓</div>
          <h3>Compartilhe conhecimento</h3>
          <p>Tem uma pesquisa? Publique e contribua com a comunidade acadêmica do IFF.</p>
          <router-link to="/criar-post" class="btn btn-primary btn-sm" id="cta-create-post">
            Publicar minha pesquisa
          </router-link>
        </div>
      </aside>
    </div>
  </div>

  <!-- Loading -->
  <div v-else-if="carregando" class="loading-container">
    <div class="loading-spinner"></div>
    <p class="muted">Carregando pesquisa...</p>
  </div>

  <!-- Error -->
  <div v-else-if="erro" class="error-container">
    <div class="alert alert-danger">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      {{ erro }}
    </div>
    <router-link to="/feed" class="btn btn-outline">Voltar ao feed</router-link>
  </div>
</template>

<script setup lang="ts">
import { usePesquisaStore } from '@/stores/pesquisa.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';

const route = useRoute();
const pesquisaStore = usePesquisaStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const pesquisa = computed(() => pesquisaStore.pesquisaSelecionada);
const carregando = computed(() => pesquisaStore.carregando);
const erro = computed(() => pesquisaStore.erro);
const pdfDisponivel = computed(() => Boolean(pesquisa.value?.pdfUrl && pesquisa.value.pdfUrl !== '#'));

onMounted(() => {
  const id = route.params.id as string;
  pesquisaStore.buscarPorId(id, { incluirRascunhos: authStore.isAutenticado });
});

const formatarData = (data: Date) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const compartilharPesquisa = async () => {
  if (!pesquisa.value) return;

  const url = window.location.href;
  const titulo = pesquisa.value.titulo;

  try {
    if (navigator.share) {
      await navigator.share({
        title: titulo,
        text: 'Pesquisa publicada no IFF Pesquisas',
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toastStore.notificar('Link da pesquisa copiado.', 'success');
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return;
    }

    toastStore.notificar('Não foi possível compartilhar agora.', 'danger');
  }
};
</script>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

/* Back Link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--muted);
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-pill);
  transition: all var(--transition-fast);
  width: fit-content;
}

.back-link:hover {
  color: var(--primary);
  background: var(--primary-light);
}

/* Hero */
.detail-hero {
  background: linear-gradient(135deg, rgba(28, 47, 99, 0.08) 0%, rgba(201, 162, 39, 0.06) 100%);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  border: 1px solid rgba(28, 47, 99, 0.10);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.hero-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.pill-area {
  background: rgba(28, 47, 99, 0.10);
  color: var(--primary);
}

.detail-hero h1 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
}

.hero-authors {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.author-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.author-avatar.orientador {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}

.author-chip div {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.author-chip strong {
  font-size: 0.92rem;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

/* Content Grid */
.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
}

/* Keywords */
.section-label {
  font-size: 0.82rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.keyword {
  font-size: 0.78rem;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--accent-light);
  color: var(--accent-2);
  font-weight: 600;
}

/* Resumo */
.resumo-section h2 {
  margin-bottom: 0.75rem;
}

.resumo-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* Image */
.research-image {
  width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

/* Sidebar */
.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 80px;
}

.info-card {
  padding: 1.5rem;
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
}

.info-label {
  color: var(--muted);
}

.info-value {
  font-weight: 600;
  color: var(--text);
}

.badge-inline {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
}

.text-success {
  color: var(--success);
}

.text-muted {
  color: var(--muted);
}

/* CTA Card */
.cta-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
}

.cta-icon {
  font-size: 1.5rem;
}

.cta-card p {
  font-size: 0.85rem;
}

/* Error Container */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    position: static;
  }

  .detail-hero {
    padding: 1.5rem;
  }

  .hero-authors {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
