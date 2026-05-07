<template>
  <section class="colab-filters" id="colab-filters">
    <div class="colab-filters__search">
      <div class="colab-filters__input-wrap">
        <svg class="colab-filters__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="colab-search-input"
          v-model="termoLocal"
          type="text"
          placeholder="Buscar por título, descrição ou competência..."
          class="colab-filters__input"
        />
        <button
          v-if="termoLocal"
          class="colab-filters__clear-input"
          title="Limpar busca"
          @click="termoLocal = ''; aplicarFiltros()"
        >
          ✕
        </button>
      </div>
    </div>

    <div class="colab-filters__row">
      <div class="colab-filters__group">
        <label for="filter-curso-desejado" class="colab-filters__label">Precisa de:</label>
        <select
          id="filter-curso-desejado"
          v-model="cursoDesejadoLocal"
          class="colab-filters__select"
          @change="aplicarFiltros"
        >
          <option value="">Todos os cursos</option>
          <option v-for="curso in cursos" :key="curso" :value="curso">{{ curso }}</option>
        </select>
      </div>

      <div class="colab-filters__group">
        <label for="filter-curso-origem" class="colab-filters__label">Publicado por:</label>
        <select
          id="filter-curso-origem"
          v-model="cursoOrigemLocal"
          class="colab-filters__select"
          @change="aplicarFiltros"
        >
          <option value="">Todos os cursos</option>
          <option v-for="curso in cursos" :key="curso" :value="curso">{{ curso }}</option>
        </select>
      </div>

      <div class="colab-filters__group">
        <label for="filter-area" class="colab-filters__label">Área:</label>
        <select
          id="filter-area"
          v-model="areaLocal"
          class="colab-filters__select"
          @change="aplicarFiltros"
        >
          <option value="">Todas as áreas</option>
          <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
        </select>
      </div>

      <div class="colab-filters__group">
        <label for="filter-urgencia" class="colab-filters__label">Urgência:</label>
        <select
          id="filter-urgencia"
          v-model="urgenciaLocal"
          class="colab-filters__select"
          @change="aplicarFiltros"
        >
          <option value="">Todas</option>
          <option value="baixa">🟢 Baixa</option>
          <option value="media">🟡 Média</option>
          <option value="alta">🔴 Alta</option>
        </select>
      </div>

      <div class="colab-filters__group">
        <label for="filter-status" class="colab-filters__label">Status:</label>
        <select
          id="filter-status"
          v-model="statusLocal"
          class="colab-filters__select"
          @change="aplicarFiltros"
        >
          <option value="">Todos</option>
          <option value="aberta">Aberta</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>
    </div>

    <div v-if="temFiltrosAtivos" class="colab-filters__actions">
      <button class="colab-filters__limpar" @click="limparTudo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        Limpar filtros
      </button>
      <span class="colab-filters__count">{{ totalResultados }} resultado(s)</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import type { FiltrosColaboracao } from '@/types';
import { CURSOS_DISPONIVEIS, AREAS_DISPONIVEIS } from '@/data/mockColaboracoes';

const emit = defineEmits<{
  (e: 'filtrar', filtros: FiltrosColaboracao): void;
  (e: 'limpar'): void;
}>();

defineProps<{
  totalResultados: number;
}>();

const cursos = CURSOS_DISPONIVEIS;
const areas = AREAS_DISPONIVEIS;

const termoLocal = ref('');
const cursoDesejadoLocal = ref('');
const cursoOrigemLocal = ref('');
const areaLocal = ref('');
const urgenciaLocal = ref('');
const statusLocal = ref('');

// Debounce na busca textual para evitar re-renders excessivos
let debounceTimer: ReturnType<typeof setTimeout>;
watch(termoLocal, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => aplicarFiltros(), 300);
});
onUnmounted(() => clearTimeout(debounceTimer));

const temFiltrosAtivos = computed(() =>
  !!(termoLocal.value || cursoDesejadoLocal.value || cursoOrigemLocal.value || areaLocal.value || urgenciaLocal.value || statusLocal.value),
);

const aplicarFiltros = () => {
  const filtros: FiltrosColaboracao = {};
  if (termoLocal.value) filtros.termo = termoLocal.value;
  if (cursoDesejadoLocal.value) filtros.cursoDesejado = cursoDesejadoLocal.value;
  if (cursoOrigemLocal.value) filtros.cursoOrigem = cursoOrigemLocal.value;
  if (areaLocal.value) filtros.area = areaLocal.value;
  if (urgenciaLocal.value) filtros.urgencia = urgenciaLocal.value as any;
  if (statusLocal.value) filtros.status = statusLocal.value as any;
  emit('filtrar', filtros);
};

const limparTudo = () => {
  termoLocal.value = '';
  cursoDesejadoLocal.value = '';
  cursoOrigemLocal.value = '';
  areaLocal.value = '';
  urgenciaLocal.value = '';
  statusLocal.value = '';
  emit('limpar');
};
</script>

<style scoped>
.colab-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.colab-filters__search {
  width: 100%;
}

.colab-filters__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.colab-filters__search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text);
  opacity: 0.5;
  pointer-events: none;
}

.colab-filters__input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.8rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 0.92rem;
  background: var(--bg);
  color: var(--text-h);
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: var(--sans);
  box-sizing: border-box;
}

.colab-filters__input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.colab-filters__clear-input {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-size: 0.85rem;
  padding: 0.25rem;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.colab-filters__clear-input:hover {
  opacity: 1;
}

.colab-filters__row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.colab-filters__group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 150px;
}

.colab-filters__label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text);
  opacity: 0.7;
}

.colab-filters__select {
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.85rem;
  background: var(--bg);
  color: var(--text-h);
  cursor: pointer;
  transition: border-color 0.2s;
  font-family: var(--sans);
}

.colab-filters__select:focus {
  outline: none;
  border-color: var(--accent);
}

.colab-filters__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.colab-filters__limpar {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text);
  transition: background 0.15s, color 0.15s;
  font-family: var(--sans);
}

.colab-filters__limpar:hover {
  background: var(--accent-bg);
  color: var(--accent);
}

.colab-filters__count {
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .colab-filters__row {
    flex-direction: column;
  }

  .colab-filters__group {
    min-width: 100%;
  }
}
</style>
