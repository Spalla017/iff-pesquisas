<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      { 'btn-loading': loading },
      { 'btn-disabled': disabled },
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner"></span>
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
});
</script>

<style scoped>
.btn {
  padding: 0.75rem 1.6rem;
  border: none;
  border-radius: var(--radius-pill);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%);
  color: #fff;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(37, 99, 235, 0.35);
}

.btn-secondary {
  background: #0f172a;
  color: #fff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-danger {
  background: linear-gradient(135deg, var(--danger) 0%, #f97316 100%);
  color: #fff;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-loading,
.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
