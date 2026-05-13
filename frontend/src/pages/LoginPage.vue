<template>
  <div class="login-page">
    <!-- Left Panel -->
    <section class="login-panel reveal">
      <div class="panel-content">
        <div class="panel-badges">
          <div class="institution-mark" aria-label="Instituto Federal Fluminense">
            <div class="if-symbol" aria-hidden="true">
              <span class="if-dot"></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="institution-text">
              <strong>Instituto Federal</strong>
              <span>Fluminense</span>
            </div>
          </div>
          <span class="access-chip">
            <span class="access-chip-dot"></span>
            Acesso institucional
          </span>
        </div>

        <h1>Seu projeto merece<br/>visibilidade</h1>
        <div class="ornament-line"></div>
        <p class="panel-desc">
          Entre com sua conta institucional para publicar pesquisas,
          acompanhar projetos e contribuir com a comunidade acadêmica do IFF.
        </p>

        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9,15 12,12 15,15"/>
              </svg>
            </div>
            <div>
              <strong>Publique com facilidade</strong>
              <span>Upload de PDF e imagens em segundos.</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <div>
              <strong>Busca inteligente</strong>
              <span>Filtre por área, autor e palavras-chave.</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <strong>Comunidade ativa</strong>
              <span>Conecte-se com orientadores e colegas.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Login Form -->
    <div class="login-form-wrapper reveal reveal-delay-1">
      <div class="login-card">
        <div class="login-header">
          <h2>Entrar na plataforma</h2>
          <p>Use suas credenciais institucionais do IFF.</p>
        </div>

        <div v-if="erro" class="alert alert-danger scale-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {{ erro }}
        </div>

        <form @submit.prevent="handleLogin" id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">Email institucional</label>
            <div class="input-with-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input
                id="login-email"
                v-model="email"
                type="email"
                class="form-input"
                placeholder="seu.email@iff.edu.br"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Senha</label>
            <div class="input-with-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input
                id="login-password"
                v-model="senha"
                :type="mostrarSenha ? 'text' : 'password'"
                class="form-input"
                placeholder="Digite sua senha"
                required
                autocomplete="current-password"
              />
              <button type="button" @click="mostrarSenha = !mostrarSenha" class="password-toggle" aria-label="Mostrar/ocultar senha">
                <svg v-if="!mostrarSenha" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="carregando"
            class="btn btn-primary btn-lg btn-full"
            id="btn-login"
          >
            <span v-if="carregando" class="btn-spinner"></span>
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="login-footer">
          <span class="muted text-sm">Ambiente seguro com autenticação institucional.</span>
          <router-link to="/recuperar-senha" class="text-sm" id="link-recover-password">Esqueci minha senha</router-link>
          <router-link to="/" class="text-sm" id="link-back-home">← Voltar para a home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const { login, carregando, erro } = useAuth();

const email = ref('');
const senha = ref('');
const mostrarSenha = ref(false);

const handleLogin = async () => {
  const sucesso = await login(email.value, senha.value);
  if (sucesso) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/feed';
    router.push(redirect);
  }
};
</script>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 2rem;
  align-items: stretch;
  min-height: calc(100vh - 200px);
}

/* Left Panel */
.login-panel {
  background: linear-gradient(160deg, var(--primary-light), var(--accent-light));
  border-radius: var(--radius-xl);
  padding: 3rem;
  border: 1px solid var(--primary-border);
  display: flex;
  align-items: center;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-badges {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.institution-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  min-height: 74px;
  padding: 0.7rem 1rem;
  background: var(--surface-glass-strong);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  backdrop-filter: blur(10px);
}

.if-symbol {
  display: grid;
  grid-template-columns: repeat(3, 9px);
  grid-template-rows: repeat(4, 9px);
  gap: 3px;
  flex-shrink: 0;
}

.if-symbol span {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: var(--primary);
}

.if-symbol .if-dot {
  grid-column: 1;
  grid-row: 1;
  border-radius: 50%;
  background: var(--danger);
}

.if-symbol span:nth-child(2) {
  grid-column: 2;
  grid-row: 1;
}

.if-symbol span:nth-child(3) {
  grid-column: 3;
  grid-row: 1;
}

.if-symbol span:nth-child(4) {
  grid-column: 1;
  grid-row: 2;
}

.if-symbol span:nth-child(5) {
  grid-column: 2;
  grid-row: 2;
}

.if-symbol span:nth-child(6) {
  grid-column: 1;
  grid-row: 3;
}

.if-symbol span:nth-child(7) {
  grid-column: 2;
  grid-row: 3;
}

.if-symbol span:nth-child(8) {
  grid-column: 3;
  grid-row: 3;
}

.if-symbol span:nth-child(9) {
  grid-column: 1;
  grid-row: 4;
}

.if-symbol span:nth-child(10) {
  grid-column: 2;
  grid-row: 4;
}

.institution-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.institution-text strong {
  color: var(--text);
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.institution-text span {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 700;
}

.access-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 38px;
  padding: 0.5rem 0.85rem;
  background: var(--primary-light);
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-md);
  color: var(--primary);
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1;
}

.access-chip-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-2);
  box-shadow: 0 0 0 4px var(--primary-light);
  flex-shrink: 0;
  animation: access-dot-pulse 1.6s ease-in-out infinite;
}

.access-chip-dot::after {
  content: '';
  position: absolute;
  inset: -6px;
  border: 1px solid var(--primary-border);
  border-radius: 50%;
  animation: access-sonar 1.8s ease-out infinite;
}

@keyframes access-dot-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 4px var(--primary-light);
  }

  50% {
    transform: scale(1.18);
    box-shadow: 0 0 0 5px var(--primary-border);
  }
}

@keyframes access-sonar {
  0% {
    opacity: 0.55;
    transform: scale(0.65);
  }

  80%,
  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}

.login-panel h1 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  margin: 0;
}

.panel-desc {
  max-width: 440px;
  font-size: 0.95rem;
}

/* Features */
.features-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.feature-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.9rem 1rem;
  background: var(--surface-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
  transition: all var(--transition-fast);
}

.feature-item:hover {
  background: var(--surface-glass-strong);
  transform: translateX(4px);
}

.feature-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-item div {
  display: flex;
  flex-direction: column;
}

.feature-item strong {
  font-size: 0.88rem;
  color: var(--text);
}

.feature-item span {
  font-size: 0.78rem;
  color: var(--muted);
}

/* Login Card */
.login-form-wrapper {
  display: flex;
  align-items: center;
}

.login-card {
  background: var(--surface);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.login-header h2 {
  margin: 0;
}

.login-header p {
  font-size: 0.88rem;
  margin: 0;
}

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon > svg:first-child {
  position: absolute;
  left: 0.9rem;
  color: var(--muted);
  opacity: 0.5;
  pointer-events: none;
}

.input-with-icon .form-input {
  width: 100%;
  padding-left: 2.6rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--muted);
  padding: 0.3rem;
  display: flex;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.password-toggle:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.btn-full {
  width: 100%;
}

.btn-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Footer */
.login-footer {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 1024px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-panel {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .login-panel,
  .login-card {
    padding: 1.5rem;
  }
}
</style>
