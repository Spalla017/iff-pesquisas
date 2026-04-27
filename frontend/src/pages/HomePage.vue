<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero section">
      <div class="hero-content">
        <div class="hero-ribbon reveal">
          <svg class="crest" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 4l22 8v16c0 14-9 26-22 32C19 54 10 42 10 28V12l22-8z" fill="currentColor" opacity="0.15"/>
            <path d="M32 8l18 7v13c0 12-7 22-18 27-11-5-18-15-18-27V15l18-7z" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M22 30h20M32 20v28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="seal">IFF</span>
          <span class="ribbon">Ambiente acadêmico</span>
          <span class="badge">Campus Itaperuna</span>
        </div>
        <h1 class="reveal reveal-delay-1">
          Ideias viram projetos.<br/>Projetos viram legado.
        </h1>
        <div class="ornament-line reveal reveal-delay-1"></div>
        <p class="hero-subtitle reveal reveal-delay-2">
          Uma plataforma acadêmica para alunos do IFF divulgarem pesquisas e projetos
          de extensão com visibilidade real para toda a comunidade.
        </p>
        <div class="hero-actions reveal reveal-delay-3">
          <router-link to="/feed" class="btn btn-primary btn-lg" id="cta-explore">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            Explorar Pesquisas
          </router-link>
          <router-link to="/criar-post" class="btn btn-outline btn-lg" id="cta-publish">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Publicar Projeto
          </router-link>
        </div>
        <div class="hero-stats">
          <div class="stat-card reveal reveal-delay-1">
            <strong>+120</strong>
            <span>pesquisas publicadas</span>
          </div>
          <div class="stat-card reveal reveal-delay-2">
            <strong>8</strong>
            <span>áreas de extensão</span>
          </div>
          <div class="stat-card reveal reveal-delay-3">
            <strong>24h</strong>
            <span>novas ideias por dia</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-card glass reveal reveal-delay-2">
          <div class="visual-header">
            <span class="pill">Destaque</span>
            <span class="pill">2026</span>
          </div>
          <h3>Impacto local com pesquisa aplicada</h3>
          <p>Conheça projetos que nasceram de desafios reais da comunidade.</p>
          <div class="visual-progress">
            <span class="progress-label">Progresso de publicação</span>
            <div class="progress-track">
              <div class="progress-bar"></div>
            </div>
          </div>
        </div>
        <div class="visual-list">
          <div class="visual-item reveal reveal-delay-1">
            <span class="dot"></span>
            <div>
              <strong>Pesquisa Interdisciplinar</strong>
              <p>Conecte áreas e crie soluções completas.</p>
            </div>
          </div>
          <div class="visual-item reveal reveal-delay-2">
            <span class="dot"></span>
            <div>
              <strong>Mentorias e orientadores</strong>
              <p>Encontre apoio e publique com confiança.</p>
            </div>
          </div>
          <div class="visual-item reveal reveal-delay-3">
            <span class="dot"></span>
            <div>
              <strong>Visibilidade para o campus</strong>
              <p>Mostre resultados para a comunidade e parceiros.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section">
      <div class="section-header">
        <div>
          <span class="badge">Simples e rápido</span>
          <h2>Como funciona</h2>
          <p>Uma jornada simples para sair da ideia e chegar na publicação.</p>
        </div>
      </div>
      <div class="grid grid-3">
        <div class="card academic-card step-card">
          <div class="step-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <span class="step-number">01</span>
          <h3>Cadastre seu projeto</h3>
          <p>Organize título, resumo e área em poucos minutos.</p>
        </div>
        <div class="card academic-card step-card">
          <div class="step-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <span class="step-number">02</span>
          <h3>Receba feedback</h3>
          <p>Compartilhe com orientadores e colegas do campus.</p>
        </div>
        <div class="card academic-card step-card">
          <div class="step-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </div>
          <span class="step-number">03</span>
          <h3>Publique e inspire</h3>
          <p>Disponibilize PDF, imagens e ganhe visibilidade real.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section highlight">
      <div class="highlight-inner">
        <div>
          <span class="badge badge-success">Comece agora</span>
          <h2>Pronto para mostrar seu projeto?</h2>
          <p>Publique suas pesquisas e contribua com toda a comunidade acadêmica.</p>
        </div>
        <div class="highlight-actions">
          <router-link to="/criar-post" class="btn btn-primary btn-lg" id="cta-bottom">
            Começar agora
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

/* Hero */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.hero-subtitle {
  font-size: 1.02rem;
  max-width: 540px;
  margin: 0;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero-ribbon {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1rem;
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transition: all var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.stat-card strong {
  font-size: 1.3rem;
  font-family: var(--font-display);
  color: var(--primary);
}

.stat-card span {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 500;
}

/* Visual Card */
.hero-visual {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.visual-card {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
}

.visual-header {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.visual-card h3 {
  margin: 0 0 0.3rem;
}

.visual-card p {
  font-size: 0.88rem;
  margin: 0;
}

.visual-progress {
  margin-top: 1.2rem;
}

.progress-label {
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: 500;
}

.progress-track {
  margin-top: 0.35rem;
  height: 7px;
  background: rgba(15, 23, 42, 0.08);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.progress-bar {
  width: 68%;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: var(--radius-pill);
  animation: progress-fill 2s ease-out;
}

@keyframes progress-fill {
  from { width: 0; }
  to { width: 68%; }
}

.visual-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.visual-item {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.9rem 1rem;
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-base);
}

.visual-item:hover {
  box-shadow: var(--shadow-sm);
  transform: translateX(4px);
}

.visual-item p {
  margin: 0.15rem 0 0;
  font-size: 0.82rem;
}

.visual-item strong {
  font-size: 0.9rem;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  margin-top: 0.5rem;
  flex-shrink: 0;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-header .badge {
  margin-bottom: 0.5rem;
}

.section-header p {
  max-width: 400px;
}

/* Step Cards */
.step-card {
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  transition: all var(--transition-base);
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.step-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.8rem;
}

.step-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-weight: 800;
  color: rgba(28, 47, 99, 0.10);
  font-size: 1.8rem;
  font-family: var(--font-display);
}

.step-card h3 {
  margin: 0 0 0.3rem;
}

.step-card p {
  font-size: 0.88rem;
  margin: 0;
}

/* CTA Highlight */
.highlight {
  background: linear-gradient(135deg, rgba(28, 47, 99, 0.08), rgba(201, 162, 39, 0.10));
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  border: 1px solid rgba(28, 47, 99, 0.12);
}

.highlight-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.highlight .badge {
  margin-bottom: 0.5rem;
}

.highlight h2 {
  margin-bottom: 0.3rem;
}

.highlight p {
  max-width: 400px;
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .highlight-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }
}
</style>
