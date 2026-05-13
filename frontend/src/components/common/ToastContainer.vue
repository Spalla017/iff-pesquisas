<template>
  <Teleport to="body">
    <div v-if="toastStore.toasts.length" class="toast-viewport" aria-live="polite" aria-atomic="false">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast scale-in"
        :class="`toast-${toast.tipo}`"
        role="status"
      >
        <span class="toast-icon" aria-hidden="true">
          <svg v-if="toast.tipo === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else-if="toast.tipo === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <svg v-else-if="toast.tipo === 'danger'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </span>
        <span class="toast-message">{{ toast.mensagem }}</span>
        <button type="button" class="toast-close" @click="toastStore.remover(toast.id)" aria-label="Fechar notificação">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store';

const toastStore = useToastStore();
</script>

<style scoped>
.toast-viewport {
  position: fixed;
  top: 82px;
  right: 1rem;
  z-index: 300;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: min(360px, calc(100vw - 2rem));
  pointer-events: none;
}

.toast {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
}

.toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.toast-message {
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.45;
}

.toast-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  color: currentColor;
  cursor: pointer;
  opacity: 0.65;
  transition: background var(--transition-fast), opacity var(--transition-fast);
}

.toast-close:hover {
  background: var(--surface-hover);
  opacity: 1;
}

.toast-info {
  border-color: var(--primary-border);
  color: var(--primary);
}

.toast-success {
  border-color: var(--success-border);
  color: var(--success);
}

.toast-warning {
  border-color: var(--warning-border);
  color: var(--warning);
}

.toast-danger {
  border-color: var(--danger-border);
  color: var(--danger);
}

@media (max-width: 600px) {
  .toast-viewport {
    top: 72px;
    right: 0.75rem;
    left: 0.75rem;
    width: auto;
  }
}
</style>
