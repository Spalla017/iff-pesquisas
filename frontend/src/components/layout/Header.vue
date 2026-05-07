<template>
  <header class="header">
    <div class="container header-inner">
      <router-link to="/" class="brand" id="header-brand">
        <span class="brand-mark">IFF</span>
        <span class="brand-stack">
          <span class="brand-text">Pesquisas</span>
          <span class="brand-sub">Campus Itaperuna</span>
        </span>
      </router-link>

      <button
        class="mobile-toggle"
        @click="menuAberto = !menuAberto"
        :aria-expanded="menuAberto"
        aria-label="Abrir menu de navegação"
        id="mobile-menu-toggle"
      >
        <span class="toggle-bar" :class="{ open: menuAberto }"></span>
        <span class="toggle-bar" :class="{ open: menuAberto }"></span>
        <span class="toggle-bar" :class="{ open: menuAberto }"></span>
      </button>

      <nav class="nav" :class="{ 'nav-open': menuAberto }" id="main-nav">
        <router-link to="/" class="nav-link" @click="fecharMenu" id="nav-home">Início</router-link>
        <router-link to="/feed" class="nav-link" @click="fecharMenu" id="nav-feed">Explorar</router-link>
        <router-link to="/colaboracoes" class="nav-link" @click="fecharMenu" id="nav-colaboracoes">Colaborações</router-link>
        <button
          type="button"
          class="theme-toggle"
          @click="alternarTema"
          :aria-label="temaEscuro ? 'Ativar tema claro' : 'Ativar tema escuro'"
          :title="temaEscuro ? 'Tema claro' : 'Tema escuro'"
          id="theme-toggle"
        >
          <svg v-if="temaEscuro" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>
        <template v-if="isAutenticado">
          <router-link to="/criar-post" class="nav-link nav-cta" @click="fecharMenu" id="nav-publish">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Publicar
          </router-link>
          <router-link to="/meus-posts" class="nav-link" @click="fecharMenu" id="nav-my-posts">Meus Posts</router-link>
          <div class="nav-divider"></div>
          <div class="user-menu">
            <div class="user-chip">
              <span class="user-avatar">{{ usuario?.nome?.charAt(0)?.toUpperCase() }}</span>
              <span class="user-name">{{ usuario?.nome }}</span>
            </div>
            <button @click="handleLogout" class="btn btn-ghost btn-sm" id="btn-logout">Sair</button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link nav-cta" @click="fecharMenu" id="nav-login">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            Entrar
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { isAutenticado, usuario, logout } = useAuth();
const router = useRouter();
const menuAberto = ref(false);
const temaEscuro = ref(false);

const aplicarTema = (escuro: boolean) => {
  temaEscuro.value = escuro;
  document.documentElement.dataset.theme = escuro ? 'dark' : 'light';
  localStorage.setItem('theme', escuro ? 'dark' : 'light');
};

const alternarTema = () => {
  aplicarTema(!temaEscuro.value);
};

const fecharMenu = () => {
  menuAberto.value = false;
};

const handleLogout = () => {
  logout();
  fecharMenu();
  router.push('/');
};

onMounted(() => {
  const temaSalvo = localStorage.getItem('theme');
  const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  aplicarTema(temaSalvo ? temaSalvo === 'dark' : prefereEscuro);
});
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(246, 242, 233, 0.88);
  border-bottom: 1px solid rgba(30, 58, 138, 0.10);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  gap: 1.5rem;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  flex-shrink: 0;
}

.brand:hover {
  color: var(--text);
}

.brand-mark {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #fff;
  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  box-shadow: 0 6px 16px rgba(30, 58, 138, 0.22);
  font-weight: 800;
}

.brand-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
}

.brand-sub {
  font-size: 0.68rem;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
}

/* Nav */
.nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.88rem;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-pill);
  transition: all var(--transition-fast);
  text-decoration: none;
  white-space: nowrap;
}

.nav-link:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.nav-link.router-link-active:not(.nav-cta) {
  background: var(--primary-light);
  color: var(--primary);
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.nav-cta {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #fff !important;
  box-shadow: 0 6px 18px rgba(30, 58, 138, 0.22);
}

.nav-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(30, 58, 138, 0.30);
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: var(--border-strong);
  margin: 0 0.25rem;
}

/* User Menu */
.user-menu {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--bg-strong);
  padding: 0.3rem 0.7rem 0.3rem 0.3rem;
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

.toggle-bar {
  width: 22px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: all var(--transition-base);
  transform-origin: center;
}

.toggle-bar.open:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.toggle-bar.open:nth-child(2) {
  opacity: 0;
}

.toggle-bar.open:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

@media (max-width: 900px) {
  .mobile-toggle {
    display: flex;
  }

  .nav {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: var(--surface);
    flex-direction: column;
    align-items: stretch;
    padding: 5rem 1.5rem 2rem;
    gap: 0.25rem;
    box-shadow: var(--shadow-lg);
    transform: translateX(100%);
    transition: transform var(--transition-slow);
    z-index: 100;
    overflow-y: auto;
  }

  .nav-open {
    transform: translateX(0);
  }

  .nav-link {
    padding: 0.8rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
  }

  .theme-toggle {
    width: 100%;
    border-radius: var(--radius-md);
  }

  .nav-divider {
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
  }

  .user-menu {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .user-chip {
    justify-content: center;
    padding: 0.6rem 1rem;
  }
}

:global(html[data-theme='dark']) .header {
  background: rgba(12, 21, 39, 0.9);
  border-bottom-color: rgba(255, 255, 255, 0.08);
}
</style>
