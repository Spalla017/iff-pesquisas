<template>
  <router-link
    :to="`/colaboracoes/${colaboracao.id}`"
    class="colab-card-link"
    :aria-label="`Abrir detalhes de ${colaboracao.titulo}`"
  >
    <article class="colab-card" :class="[`urgencia-${colaboracao.urgencia}`, `status-${colaboracao.status}`]">
      <div class="colab-card__header">
        <span class="colab-card__urgencia" :style="{ background: urgenciaInfo.cor }">
          {{ urgenciaInfo.label }}
        </span>
        <span class="colab-card__status" :style="{ color: statusInfo.cor }">
          {{ statusInfo.label }}
        </span>
      </div>

      <div v-if="colaboracao.imagemUrl" class="colab-card__img-wrap">
        <img :src="colaboracao.imagemUrl" :alt="colaboracao.titulo" class="colab-card__img" loading="lazy" />
      </div>

      <div class="colab-card__body">
        <h3 class="colab-card__titulo">{{ colaboracao.titulo }}</h3>

        <p class="colab-card__descricao">{{ descricaoResumida }}</p>

        <div class="colab-card__origem">
          <span class="colab-card__label">Publicado por:</span>
          <span class="colab-card__curso-badge colab-card__curso-badge--origem">{{ colaboracao.cursoOrigem }}</span>
        </div>

        <div class="colab-card__destino">
          <span class="colab-card__label">Precisa de:</span>
          <div class="colab-card__cursos-list">
            <span
              v-for="curso in colaboracao.cursosDesejados"
              :key="curso"
              class="colab-card__curso-badge colab-card__curso-badge--destino"
            >
              {{ curso }}
            </span>
          </div>
        </div>

        <div v-if="colaboracao.competenciasNecessarias.length > 0" class="colab-card__competencias">
          <span
            v-for="comp in competenciasVisiveis"
            :key="comp"
            class="colab-card__tag"
          >
            {{ comp }}
          </span>
          <span v-if="competenciasExtras > 0" class="colab-card__tag colab-card__tag--extra">
            +{{ competenciasExtras }}
          </span>
        </div>
      </div>

      <div class="colab-card__footer">
        <div class="colab-card__meta">
          <span class="colab-card__autor">{{ colaboracao.autor }}</span>
          <span class="colab-card__interessados" :title="`${colaboracao.interessados.length} interessado(s)`">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {{ colaboracao.interessados.length }}
          </span>
        </div>
        <span class="colab-card__link">Ver detalhes -></span>
      </div>
    </article>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Colaboracao } from '@/types';
import { URGENCIA_LABELS, STATUS_LABELS } from '@/data/mockColaboracoes';

const props = defineProps<{
  colaboracao: Colaboracao;
}>();

const MAX_DESCRICAO = 120;
const MAX_COMPETENCIAS = 3;

const descricaoResumida = computed(() => {
  if (props.colaboracao.descricao.length <= MAX_DESCRICAO) return props.colaboracao.descricao;
  return props.colaboracao.descricao.substring(0, MAX_DESCRICAO).trim() + '...';
});

const competenciasVisiveis = computed(() =>
  props.colaboracao.competenciasNecessarias.slice(0, MAX_COMPETENCIAS),
);

const competenciasExtras = computed(() =>
  Math.max(0, props.colaboracao.competenciasNecessarias.length - MAX_COMPETENCIAS),
);

const urgenciaInfo = computed(() => URGENCIA_LABELS[props.colaboracao.urgencia] || URGENCIA_LABELS.baixa);
const statusInfo = computed(() => STATUS_LABELS[props.colaboracao.status] || STATUS_LABELS.aberta);

</script>

<style scoped>
.colab-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: var(--radius-md);
}

.colab-card-link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.colab-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left;
}

.colab-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.colab-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border);
  gap: 0.5rem;
}

.colab-card__urgencia {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text);
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.colab-card__status {
  font-size: 0.78rem;
  font-weight: 600;
}

.colab-card__img-wrap {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.colab-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.colab-card:hover .colab-card__img {
  transform: scale(1.05);
}

.colab-card__body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.colab-card__titulo {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
  line-height: 1.35;
}

.colab-card__descricao {
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.5;
  margin: 0;
}

.colab-card__label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.colab-card__origem,
.colab-card__destino {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.colab-card__cursos-list {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.colab-card__curso-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  white-space: nowrap;
}

.colab-card__curso-badge--origem {
  background: var(--accent-light);
  color: var(--accent);
  border: 1px solid var(--border-strong);
}

.colab-card__curso-badge--destino {
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid var(--primary-border);
}

.colab-card__competencias {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.colab-card__tag {
  font-size: 0.7rem;
  background: var(--surface-2);
  color: var(--text);
  padding: 0.18rem 0.55rem;
  border-radius: 6px;
  white-space: nowrap;
}

.colab-card__tag--extra {
  font-weight: 700;
  color: var(--accent);
}

.colab-card__footer {
  padding: 0.85rem 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.colab-card__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.colab-card__autor {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text);
}

.colab-card__interessados {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent);
}

.colab-card__interessados svg {
  opacity: 0.8;
}

.colab-card__link {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
  transition: opacity 0.15s;
}

.colab-card:hover .colab-card__link {
  opacity: 0.75;
}
</style>

