<template>
  <div class="colaboracoes-page">
    <header class="colaboracoes-page__header">
      <div class="colaboracoes-page__title-wrap">
        <h1 class="colaboracoes-page__title">🤝 Colaborações entre Cursos</h1>
        <p class="colaboracoes-page__subtitle">
          Encontre projetos interdisciplinares que precisam da sua expertise — ou solicite ajuda de outros cursos.
        </p>
      </div>
      <router-link
        v-if="authStore.isAutenticado"
        to="/solicitar-colaboracao"
        class="colaboracoes-page__cta"
      >
        + Nova Solicitação
      </router-link>
    </header>

    <ColaboracaoFilters
      :total-resultados="store.colaboracoesFiltradas.length"
      @filtrar="handleFiltrar"
      @limpar="handleLimpar"
    />

    <!-- Loading -->
    <div v-if="store.carregando" class="colaboracoes-page__loading">
      <div class="colaboracoes-page__spinner" />
      <p>Carregando colaborações...</p>
    </div>

    <!-- Grid -->
    <div v-else-if="store.colaboracoesPaginadas.length > 0" class="colaboracoes-page__grid">
      <ColaboracaoCard
        v-for="colab in store.colaboracoesPaginadas"
        :key="colab.id"
        :colaboracao="colab"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="colaboracoes-page__empty">
      <div class="colaboracoes-page__empty-icon">🔍</div>
      <h2>Nenhuma colaboração encontrada</h2>
      <p>Tente ajustar os filtros ou seja o primeiro a solicitar uma colaboração!</p>
      <router-link v-if="authStore.isAutenticado" to="/solicitar-colaboracao" class="colaboracoes-page__cta colaboracoes-page__cta--secondary">
        Solicitar Colaboração
      </router-link>
    </div>

    <!-- Pagination -->
    <nav v-if="store.totalPaginas > 1" class="colaboracoes-page__pagination">
      <button
        class="colaboracoes-page__pg-btn"
        :disabled="store.paginacao.pagina <= 1"
        @click="store.irParaPagina(store.paginacao.pagina - 1)"
      >
        ← Anterior
      </button>
      <span class="colaboracoes-page__pg-info">
        Página {{ store.paginacao.pagina }} de {{ store.totalPaginas }}
      </span>
      <button
        class="colaboracoes-page__pg-btn"
        :disabled="store.paginacao.pagina >= store.totalPaginas"
        @click="store.irParaPagina(store.paginacao.pagina + 1)"
      >
        Próxima →
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useColaboracaoStore } from '@/stores/colaboracao.store';
import { useAuthStore } from '@/stores/auth.store';
import type { FiltrosColaboracao } from '@/types';
import ColaboracaoCard from '@/components/common/ColaboracaoCard.vue';
import ColaboracaoFilters from '@/components/common/ColaboracaoFilters.vue';

const store = useColaboracaoStore();
const authStore = useAuthStore();

onMounted(() => {
  store.buscarColaboracoes();
});

const handleFiltrar = (filtros: FiltrosColaboracao) => {
  store.buscarColaboracoes(filtros);
};

const handleLimpar = () => {
  store.resetarFiltros();
  store.buscarColaboracoes({});
};
</script>

<style scoped>
.colaboracoes-page {
  padding: 2rem 0;
  text-align: left;
}

.colaboracoes-page__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.colaboracoes-page__title-wrap {
  flex: 1;
}

.colaboracoes-page__title {
  font-family: var(--heading);
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-h);
  margin: 0 0 0.5rem;
  letter-spacing: -0.5px;
}

.colaboracoes-page__subtitle {
  color: var(--text);
  font-size: 0.95rem;
  margin: 0;
  max-width: 550px;
  line-height: 1.5;
}

.colaboracoes-page__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
  font-family: var(--sans);
  flex-shrink: 0;
}

.colaboracoes-page__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(170, 59, 255, 0.3);
}

.colaboracoes-page__cta--secondary {
  background: transparent;
  color: var(--accent);
  border: 2px solid var(--accent);
}

.colaboracoes-page__cta--secondary:hover {
  background: var(--accent-bg);
}

/* Grid */
.colaboracoes-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

/* Loading */
.colaboracoes-page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: var(--text);
}

.colaboracoes-page__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* Empty State */
.colaboracoes-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 4rem 0;
  text-align: center;
}

.colaboracoes-page__empty-icon {
  font-size: 3rem;
}

.colaboracoes-page__empty h2 {
  font-size: 1.2rem;
  margin: 0;
}

.colaboracoes-page__empty p {
  color: var(--text);
  font-size: 0.9rem;
  max-width: 400px;
}

/* Pagination */
.colaboracoes-page__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.colaboracoes-page__pg-btn {
  padding: 0.5rem 1.2rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text-h);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  font-family: var(--sans);
}

.colaboracoes-page__pg-btn:hover:not(:disabled) {
  border-color: var(--accent);
  background: var(--accent-bg);
}

.colaboracoes-page__pg-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.colaboracoes-page__pg-info {
  font-size: 0.85rem;
  color: var(--text);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .colaboracoes-page__title {
    font-size: 1.5rem;
  }

  .colaboracoes-page__grid {
    grid-template-columns: 1fr;
  }

  .colaboracoes-page__header {
    flex-direction: column;
  }
}
</style>
