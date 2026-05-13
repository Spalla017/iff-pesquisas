<template>
  <div class="search-filters" id="search-filters">
    <!-- Search Bar -->
    <div class="search-bar">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <input
        type="text"
        :value="termoBusca"
        @input="$emit('update:termoBusca', ($event.target as HTMLInputElement).value)"
        placeholder="Buscar por título, resumo ou palavras-chave..."
        class="search-input"
        id="search-input"
      />
      <button
        v-if="termoBusca"
        @click="$emit('update:termoBusca', '')"
        class="search-clear"
        aria-label="Limpar busca"
        id="search-clear"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="filter-section">
        <span class="filter-label">Área:</span>
        <div class="filter-pills">
          <button
            class="pill pill-interactive"
            :class="{ 'pill-active': !areaSelecionada }"
            @click="$emit('update:areaSelecionada', '')"
            id="filter-area-all"
          >
            Todas
          </button>
          <button
            v-for="area in areas"
            :key="area"
            class="pill pill-interactive"
            :class="{ 'pill-active': areaSelecionada === area }"
            @click="$emit('update:areaSelecionada', area)"
            :id="`filter-area-${area.toLowerCase().replace(/\s/g, '-')}`"
          >
            {{ area }}
          </button>
        </div>
      </div>

      <!-- Advanced Filters Toggle -->
      <button
        class="filter-toggle"
        @click="mostrarAvancados = !mostrarAvancados"
        :class="{ active: mostrarAvancados }"
        id="toggle-advanced-filters"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>
        </svg>
        {{ mostrarAvancados ? 'Menos filtros' : 'Mais filtros' }}
      </button>
    </div>

    <!-- Advanced Filters -->
    <div v-if="mostrarAvancados" class="advanced-filters fade-in">
      <div class="filter-field">
        <label class="form-label" for="filter-autor">Autor / Aluno</label>
        <input
          type="text"
          :value="autorBusca"
          @input="$emit('update:autorBusca', ($event.target as HTMLInputElement).value)"
          placeholder="Nome do aluno..."
          class="form-input"
          id="filter-autor"
        />
      </div>
      <div class="filter-field">
        <label class="form-label" for="filter-orientador">Orientador</label>
        <input
          type="text"
          :value="orientadorBusca"
          @input="$emit('update:orientadorBusca', ($event.target as HTMLInputElement).value)"
          placeholder="Nome do orientador..."
          class="form-input"
          id="filter-orientador"
        />
      </div>
      <button
        v-if="temFiltrosAtivos"
        @click="$emit('limpar')"
        class="btn btn-ghost btn-sm"
        id="btn-clear-filters"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        Limpar filtros
      </button>
    </div>

    <!-- Active Filters Summary -->
    <div v-if="temFiltrosAtivos" class="active-filters">
      <span class="filter-count">{{ totalResultados }} resultado{{ totalResultados !== 1 ? 's' : '' }}</span>
      <div class="active-tags" v-if="termoBusca || areaSelecionada || autorBusca || orientadorBusca">
        <span v-if="termoBusca" class="active-tag">
          Busca: {{ termoBusca }}
          <button @click="$emit('update:termoBusca', '')" class="tag-remove" aria-label="Remover termo de busca">×</button>
        </span>
        <span v-if="areaSelecionada" class="active-tag">
          {{ areaSelecionada }}
          <button @click="$emit('update:areaSelecionada', '')" class="tag-remove" aria-label="Remover filtro de área">×</button>
        </span>
        <span v-if="autorBusca" class="active-tag">
          Autor: {{ autorBusca }}
          <button @click="$emit('update:autorBusca', '')" class="tag-remove" aria-label="Remover filtro de autor">×</button>
        </span>
        <span v-if="orientadorBusca" class="active-tag">
          Orientador: {{ orientadorBusca }}
          <button @click="$emit('update:orientadorBusca', '')" class="tag-remove" aria-label="Remover filtro de orientador">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  termoBusca: string;
  areaSelecionada: string;
  autorBusca: string;
  orientadorBusca: string;
  areas: string[];
  totalResultados: number;
  temFiltrosAtivos: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:termoBusca': [value: string];
  'update:areaSelecionada': [value: string];
  'update:autorBusca': [value: string];
  'update:orientadorBusca': [value: string];
  'limpar': [];
}>();

const mostrarAvancados = ref(false);
</script>

<style scoped>
.search-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Search Bar */
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--muted);
  pointer-events: none;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.8rem;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  font-family: inherit;
  font-size: 0.95rem;
  background: var(--surface);
  color: var(--text);
  transition: all var(--transition-fast);
  outline: none;
}

.search-input:hover {
  border-color: var(--border-strong);
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--ring), var(--shadow-md);
}

.search-clear {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.35rem;
  color: var(--muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  transition: all var(--transition-fast);
}

.search-clear:hover {
  background: var(--danger-light);
  color: var(--danger);
}

/* Filters Row */
.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.filter-label {
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--muted);
  white-space: nowrap;
}

.filter-pills {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  font-family: inherit;
}

.filter-toggle:hover,
.filter-toggle.active {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

/* Advanced Filters */
.advanced-filters {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 1rem 1.2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 180px;
}

/* Active Filters */
.active-filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-count {
  font-size: 0.82rem;
  color: var(--muted);
  font-weight: 500;
}

.active-tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.active-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 600;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.tag-remove:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
  }

  .advanced-filters {
    flex-direction: column;
  }

  .filter-field {
    min-width: 100%;
  }
}
</style>
