<template>
  <div class="not-found-page">
    <div class="not-found-card scale-in">
      <div class="error-code">404</div>
      <div class="ornament-line"></div>
      <h1>Página não encontrada</h1>
      <p>
        Essa rota não existe ou foi movida. Volte para explorar pesquisas
        e projetos de extensão do IFF.
      </p>
      <div class="actions">
        <router-link to="/" class="btn btn-primary" id="btn-404-home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Voltar para home
        </router-link>
        <router-link to="/feed" class="btn btn-outline" id="btn-404-feed">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          Explorar pesquisas
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  text-align: center;
  padding: 2rem;
}

.not-found-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 3rem;
  box-shadow: var(--shadow-md);
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.error-code {
  font-family: var(--font-display);
  font-size: 5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: -0.04em;
}

.not-found-card h1 {
  font-size: 1.6rem;
  margin: 0;
}

.not-found-card p {
  max-width: 360px;
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}
</style>
