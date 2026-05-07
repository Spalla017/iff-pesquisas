<template>
  <div id="app">
    <Header />
    <ToastContainer />
    <main>
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="footer-mark">IFF</span>
          <div>
            <strong class="footer-title">IFF Pesquisas</strong>
            <p class="footer-desc">Plataforma acadêmica para divulgação de pesquisas e projetos de extensão.</p>
          </div>
        </div>
        <div class="footer-links">
          <span class="footer-links-title">Navegação</span>
          <router-link to="/feed">Explorar pesquisas</router-link>
          <router-link to="/colaboracoes">Colaborações entre cursos</router-link>
          <router-link to="/criar-post">Publicar projeto</router-link>
          <router-link to="/login">Acessar conta</router-link>
        </div>
        <div class="footer-info">
          <span class="footer-links-title">Informações</span>
          <span>Instituto Federal Fluminense</span>
          <span>Campus Itaperuna — RJ</span>
          <span class="pill footer-pill">Versão 1.0 · 2026</span>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <span>&copy; 2026 IFF Campus Itaperuna. Todos os direitos reservados.</span>
          <span class="muted">Desenvolvido como projeto de TCC — Sistemas de Informação</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const authStore = useAuthStore()
const router = useRouter()

const focarBuscaDoFeed = (tentativasRestantes = 10) => {
  const inputBusca = document.getElementById('search-input')
  if (inputBusca) {
    inputBusca.focus()
    return
  }

  if (tentativasRestantes > 0) {
    window.setTimeout(() => focarBuscaDoFeed(tentativasRestantes - 1), 80)
  }
}

const handleGlobalShortcut = (event: KeyboardEvent) => {
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') {
    return
  }

  event.preventDefault()
  router.push('/feed').then(() => {
    focarBuscaDoFeed()
  })
}

onMounted(() => {
  authStore.carregarUsuarioSalvo()
  window.addEventListener('keydown', handleGlobalShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalShortcut)
})
</script>

<style scoped>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Footer */
.footer {
  background: #0c1527;
  color: rgba(255, 255, 255, 0.85);
  margin-top: var(--spacing-3xl);
}

.footer-inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 2.5rem;
  padding: 3rem 0;
}

.footer-brand {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
}

.footer-mark {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #fff;
  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  font-weight: 800;
  flex-shrink: 0;
}

.footer-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
}

.footer-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.82rem;
  margin: 0.3rem 0 0;
  max-width: 280px;
  line-height: 1.5;
}

.footer-links,
.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links-title {
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.3rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.88rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: #fff;
}

.footer-info span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.footer-pill {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.3rem;
  width: fit-content;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2.5rem 0;
  }

  .footer-bottom-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
