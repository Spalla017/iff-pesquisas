<template>
  <div class="feed-page">
    <!-- Hero Section -->
    <section class="feed-hero reveal">
      <div class="hero-content">
        <div class="hero-badges">
          <span class="badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            Acervo atualizado
          </span>
        </div>
        <h1>Descubra pesquisas que inspiram</h1>
        <p class="hero-subtitle">
          Explore projetos de extensão do IFF Itaperuna, filtre por área de conhecimento
          e encontre ideias para seus próximos estudos.
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <strong>{{ totalPesquisas }}</strong>
          <span>pesquisas</span>
        </div>
        <div class="stat">
          <strong>{{ areasUnicas }}</strong>
          <span>áreas</span>
        </div>
      </div>
    </section>

    <!-- Search & Filters -->
    <section class="feed-filters reveal reveal-delay-1">
      <SearchFilters
        v-model:termo-busca="termoBusca"
        v-model:area-selecionada="areaSelecionada"
        v-model:autor-busca="autorBusca"
        v-model:orientador-busca="orientadorBusca"
        :areas="areas"
        :total-resultados="pesquisasFiltradas.length"
        :tem-filtros-ativos="temFiltrosAtivos"
        @limpar="limparFiltros"
      />
    </section>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="muted">Carregando pesquisas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="erro" class="alert alert-danger">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      {{ erro }}
    </div>

    <!-- Empty State -->
    <div v-else-if="pesquisasPaginadas.length === 0" class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <h3>Nenhuma pesquisa encontrada</h3>
      <p class="muted">Tente ajustar os filtros ou termos de busca.</p>
      <button @click="limparFiltros" class="btn btn-outline btn-sm" id="btn-empty-clear">
        Limpar todos os filtros
      </button>
    </div>

    <!-- Results Grid -->
    <section v-else class="feed-results reveal reveal-delay-2">
      <div class="results-toolbar">
        <div>
          <span class="toolbar-kicker">Resultados</span>
          <strong>{{ pesquisasFiltradas.length }} pesquisa{{ pesquisasFiltradas.length !== 1 ? 's' : '' }} encontrada{{ pesquisasFiltradas.length !== 1 ? 's' : '' }}</strong>
        </div>
        <span class="muted text-sm">Página {{ paginaAtual }} de {{ totalPaginas }}</span>
      </div>

      <div class="results-grid">
        <PesquisaCard
          v-for="pesquisa in pesquisasPaginadas"
          :key="pesquisa.id"
          :pesquisa="pesquisa"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPaginas > 1" class="pagination" id="pagination">
        <button
          class="btn btn-outline btn-sm"
          :disabled="paginaAtual <= 1"
          @click="mudarPagina(paginaAtual - 1)"
          id="btn-prev-page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Anterior
        </button>

        <div class="page-numbers">
          <button
            v-for="pagina in paginasVisiveis"
            :key="pagina"
            class="page-btn"
            :class="{ 'page-active': pagina === paginaAtual }"
            @click="mudarPagina(pagina)"
          >
            {{ pagina }}
          </button>
        </div>

        <button
          class="btn btn-outline btn-sm"
          :disabled="paginaAtual >= totalPaginas"
          @click="mudarPagina(paginaAtual + 1)"
          id="btn-next-page"
        >
          Próxima
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePesquisaStore } from '@/stores/pesquisa.store';
import { AREAS_DISPONIVEIS } from '@/data/mockPesquisas';
import SearchFilters from '@/components/common/SearchFilters.vue';
import PesquisaCard from '@/components/common/PesquisaCard.vue';

const pesquisaStore = usePesquisaStore();
const route = useRoute();

// Filter state
const termoBusca = ref('');
const areaSelecionada = ref('');
const autorBusca = ref('');
const orientadorBusca = ref('');

const areas = AREAS_DISPONIVEIS;

// Computed
const pesquisasFiltradas = computed(() => pesquisaStore.pesquisasFiltradas);
const pesquisasPaginadas = computed(() => pesquisaStore.pesquisasPaginadas);
const carregando = computed(() => pesquisaStore.carregando);
const erro = computed(() => pesquisaStore.erro);
const totalPaginas = computed(() => pesquisaStore.totalPaginas);
const paginaAtual = computed(() => pesquisaStore.paginacao.pagina);

const totalPesquisas = computed(() => pesquisaStore.todasPesquisas.length);
const areasUnicas = computed(() => {
  const areasSet = new Set(pesquisaStore.todasPesquisas.map(p => p.area));
  return areasSet.size;
});

const temFiltrosAtivos = computed(() =>
  !!termoBusca.value || !!areaSelecionada.value || !!autorBusca.value || !!orientadorBusca.value
);

const paginasVisiveis = computed(() => {
  const total = totalPaginas.value;
  const current = paginaAtual.value;
  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Debounced filter sync
let debounceTimer: ReturnType<typeof setTimeout>;

const sincronizarFiltros = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    pesquisaStore.buscarPesquisas({
      termo: termoBusca.value || undefined,
      area: areaSelecionada.value || undefined,
      autor: autorBusca.value || undefined,
      orientador: orientadorBusca.value || undefined,
    });
  }, 250);
};

watch([termoBusca, areaSelecionada, autorBusca, orientadorBusca], sincronizarFiltros);

const limparFiltros = () => {
  termoBusca.value = '';
  areaSelecionada.value = '';
  autorBusca.value = '';
  orientadorBusca.value = '';
  pesquisaStore.resetarFiltros();
  pesquisaStore.buscarPesquisas();
};

const mudarPagina = (pagina: number) => {
  pesquisaStore.irParaPagina(pagina);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  const queryBusca = typeof route.query.q === 'string' ? route.query.q : '';
  const queryArea = typeof route.query.area === 'string' ? route.query.area : '';

  termoBusca.value = queryBusca;
  areaSelecionada.value = queryArea;

  pesquisaStore.buscarPesquisas({
    termo: queryBusca || undefined,
    area: queryArea || undefined,
  });
});
</script>

<style scoped>
.feed-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Hero */
.feed-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 2rem 2.5rem;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(28, 47, 99, 0.10) 0%, rgba(15, 90, 107, 0.08) 50%, rgba(201, 162, 39, 0.08) 100%);
  border: 1px solid rgba(28, 47, 99, 0.12);
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hero-badges {
  display: flex;
  gap: 0.5rem;
}

.feed-hero h1 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin: 0;
}

.hero-subtitle {
  max-width: 520px;
  margin: 0;
  font-size: 0.92rem;
}

.hero-stats {
  display: flex;
  gap: 1.5rem;
  flex-shrink: 0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
}

.stat strong {
  font-size: 1.4rem;
  font-family: var(--font-display);
  color: var(--primary);
}

.stat span {
  font-size: 0.75rem;
  color: var(--muted);
  font-weight: 500;
}

/* Results */
.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.results-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--border);
}

.results-toolbar > div {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.results-toolbar strong {
  font-family: var(--font-display);
  font-size: 1.05rem;
}

.toolbar-kicker {
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.page-numbers {
  display: flex;
  gap: 0.3rem;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.page-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.page-active {
  background: var(--primary) !important;
  color: #fff !important;
  border-color: var(--primary) !important;
}

@media (max-width: 1024px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .feed-hero {
    flex-direction: column;
    padding: 1.5rem;
    align-items: flex-start;
  }

  .hero-stats {
    width: 100%;
  }

  .stat {
    flex: 1;
  }

  .results-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
