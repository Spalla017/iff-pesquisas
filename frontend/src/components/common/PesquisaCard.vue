<template>
  <article class="pesquisa-card card card-interactive" :id="`pesquisa-card-${pesquisa.id}`">
    <div v-if="pesquisa.imagemUrl" class="card-media">
      <img :src="pesquisa.imagemUrl" :alt="pesquisa.titulo" loading="lazy" />
    </div>

    <div class="card-header">
      <div class="card-tags">
        <span class="pill pill-area">{{ pesquisa.area }}</span>
        <span class="pill">{{ formatarData(pesquisa.dataPublicacao) }}</span>
      </div>
      <div v-if="temPdfDisponivel(pesquisa.pdfUrl)" class="card-pdf-badge" title="PDF disponível">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
    </div>

    <h3 class="card-title">{{ pesquisa.titulo }}</h3>
    <p class="card-resumo">{{ pesquisa.resumo }}</p>

    <div class="card-keywords" v-if="pesquisa.palavrasChave?.length">
      <span
        v-for="keyword in pesquisa.palavrasChave.slice(0, 3)"
        :key="keyword"
        class="keyword"
      >{{ keyword }}</span>
    </div>

    <div class="card-footer">
      <div class="card-authors">
        <div class="author-avatar">{{ pesquisa.autor.charAt(0) }}</div>
        <div class="author-info">
          <span class="author-name">{{ pesquisa.autor }}</span>
          <span class="author-orientador">Orient. {{ pesquisa.orientador }}</span>
        </div>
      </div>
      <router-link :to="`/pesquisa/${pesquisa.id}`" class="card-link" :id="`link-pesquisa-${pesquisa.id}`">
        Ver detalhes
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </router-link>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Pesquisa } from '@/types';

interface Props {
  pesquisa: Pesquisa;
}

defineProps<Props>();

const formatarData = (data: Date) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const temPdfDisponivel = (pdfUrl?: string) => Boolean(pdfUrl && pdfUrl !== '#');
</script>

<style scoped>
.pesquisa-card {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.5rem;
  background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  cursor: default;
}

.pesquisa-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(28, 47, 99, 0.18);
}

.card-media {
  height: 168px;
  margin: -1.5rem -1.5rem 0;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  overflow: hidden;
  background: var(--bg-strong);
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.pill-area {
  background: rgba(28, 47, 99, 0.10);
  color: var(--primary);
}

.card-pdf-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--success-light);
  color: var(--success);
  flex-shrink: 0;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-resumo {
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-keywords {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.keyword {
  font-size: 0.72rem;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-pill);
  background: var(--accent-light);
  color: var(--accent-2);
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.8rem;
  border-top: 1px solid var(--border);
}

.card-authors {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.2;
}

.author-orientador {
  font-size: 0.72rem;
  color: var(--muted);
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 700;
  font-size: 0.82rem;
  color: var(--primary);
  text-decoration: none;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-pill);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.card-link:hover {
  background: var(--primary-light);
  color: var(--primary-2);
}

@media (max-width: 600px) {
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
