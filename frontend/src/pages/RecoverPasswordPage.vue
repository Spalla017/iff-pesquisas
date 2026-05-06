<template>
  <div class="recover-page">
    <section class="recover-card card reveal">
      <div class="recover-header">
        <span class="badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Acesso institucional
        </span>
        <h1>Recuperar senha</h1>
        <p>Informe seu e-mail institucional para receber as instruções de redefinição.</p>
      </div>

      <div v-if="mensagemSucesso" class="alert alert-success scale-in">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ mensagemSucesso }}
      </div>

      <div v-if="erro" class="alert alert-danger scale-in">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        {{ erro }}
      </div>

      <form @submit.prevent="handleSubmit" class="recover-form">
        <div class="form-group">
          <label class="form-label" for="recover-email">Email institucional</label>
          <input
            id="recover-email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="seu.email@iff.edu.br"
            autocomplete="email"
            required
          />
        </div>

        <button type="submit" :disabled="carregando" class="btn btn-primary btn-lg btn-full">
          <span v-if="carregando" class="btn-spinner"></span>
          {{ carregando ? 'Enviando...' : 'Enviar instruções' }}
        </button>
      </form>

      <div class="recover-footer">
        <router-link to="/login" class="text-sm">← Voltar para o login</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToastStore } from '@/stores/toast.store';
import { recoverPasswordSchema, extrairErroZod } from '@/schemas';

const toastStore = useToastStore();
const email = ref('');
const erro = ref('');
const mensagemSucesso = ref('');
const carregando = ref(false);

const handleSubmit = async () => {
  erro.value = '';
  mensagemSucesso.value = '';

  const validacao = recoverPasswordSchema.safeParse({
    email: email.value.trim().toLowerCase(),
  });

  if (!validacao.success) {
    erro.value = extrairErroZod(validacao) ?? 'Dados inválidos.';
    return;
  }

  carregando.value = true;
  await new Promise(resolve => setTimeout(resolve, 600));
  carregando.value = false;

  mensagemSucesso.value = 'Instruções enviadas para o e-mail informado.';
  toastStore.notificar('Verifique sua caixa de entrada institucional.', 'success');
};
</script>

<style scoped>
.recover-page {
  min-height: calc(100vh - 260px);
  display: grid;
  place-items: center;
}

.recover-card {
  width: min(100%, 520px);
  padding: 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.recover-header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.recover-header h1 {
  margin: 0;
}

.recover-header p {
  margin: 0;
}

.recover-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.recover-footer {
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 600px) {
  .recover-card {
    padding: 1.5rem;
  }
}
</style>
