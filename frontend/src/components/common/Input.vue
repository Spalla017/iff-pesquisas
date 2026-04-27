<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="input"
    />
    <small v-if="error" class="error">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  id: 'input-' + Math.random().toString(36).substr(2, 9),
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--muted);
}

.input {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.9);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow: 0 0 0 4px var(--ring);
  background: #fff;
}

.input:disabled {
  background-color: var(--bg-strong);
  cursor: not-allowed;
}

.error {
  color: var(--danger);
  font-size: 0.75rem;
}
</style>
