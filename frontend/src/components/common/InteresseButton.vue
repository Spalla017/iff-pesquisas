<template>
  <div class="interesse-btn-wrap">
    <button
      v-if="!isAutor"
      class="interesse-btn"
      :class="{
        'interesse-btn--ativo': jaInteressado,
        'interesse-btn--disabled': !isLogado || processando,
      }"
      :disabled="!isLogado || processando"
      :title="tooltipTexto"
      @click="toggleInteresse"
    >
      <transition name="icon-swap" mode="out-in">
        <span v-if="processando" key="loading" class="interesse-btn__spinner" />
        <span v-else-if="jaInteressado" key="check" class="interesse-btn__icon">✓</span>
        <span v-else key="hand" class="interesse-btn__icon">🤝</span>
      </transition>
      <span class="interesse-btn__text">{{ textoBtn }}</span>
    </button>

    <p v-if="!isLogado && !isAutor" class="interesse-btn__hint">
      <router-link to="/login">Faça login</router-link> para demonstrar interesse
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useColaboracaoStore } from '@/stores/colaboracao.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';

const props = defineProps<{
  colaboracaoId: string;
}>();

const colaboracaoStore = useColaboracaoStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const processando = ref(false);

const isLogado = computed(() => authStore.isAutenticado);
const isAutor = computed(() => colaboracaoStore.usuarioEhAutor(props.colaboracaoId));
const jaInteressado = computed(() => colaboracaoStore.usuarioJaInteressado(props.colaboracaoId));

const textoBtn = computed(() => {
  if (processando.value) return 'Processando...';
  if (jaInteressado.value) return 'Interesse registrado';
  return 'Tenho interesse';
});

const tooltipTexto = computed(() => {
  if (!isLogado.value) return 'Faça login para demonstrar interesse';
  if (jaInteressado.value) return 'Clique para cancelar seu interesse';
  return 'Clique para demonstrar interesse nesta colaboração';
});

const toggleInteresse = async () => {
  if (!isLogado.value || processando.value) return;

  processando.value = true;

  try {
    if (jaInteressado.value) {
      const ok = await colaboracaoStore.removerInteresse(props.colaboracaoId);
      if (ok) {
        toastStore.notificar('Interesse removido.', 'info');
      }
    } else {
      const ok = await colaboracaoStore.demonstrarInteresse(props.colaboracaoId);
      if (ok) {
        toastStore.notificar('Interesse registrado com sucesso! 🎉', 'success');
      } else {
        toastStore.notificar('Não foi possível registrar o interesse.', 'error');
      }
    }
  } finally {
    processando.value = false;
  }
};
</script>

<style scoped>
.interesse-btn-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.interesse-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.7rem 1.4rem;
  border: 2px solid var(--accent);
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: var(--sans);
  background: var(--accent);
  color: #fff;
}

.interesse-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(170, 59, 255, 0.25);
}

.interesse-btn--ativo {
  background: transparent;
  color: var(--accent);
  border-color: var(--accent);
}

.interesse-btn--ativo:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
  color: #ef4444;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15);
}

.interesse-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.interesse-btn--disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

.interesse-btn__icon {
  font-size: 1.1rem;
}

.interesse-btn__text {
  white-space: nowrap;
}

.interesse-btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.interesse-btn--ativo .interesse-btn__spinner {
  border-color: rgba(170, 59, 255, 0.2);
  border-top-color: var(--accent);
}

.interesse-btn__hint {
  font-size: 0.78rem;
  color: var(--text);
  opacity: 0.6;
  margin: 0;
}

.interesse-btn__hint a {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.interesse-btn__hint a:hover {
  text-decoration: underline;
}

/* Transitions */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.icon-swap-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
