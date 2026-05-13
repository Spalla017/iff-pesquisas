<template>
  <div class="colab-detail-page">
    <!-- Loading -->
    <div v-if="store.carregando" class="colab-detail-page__loading">
      <div class="colab-detail-page__spinner" />
      <p>Carregando detalhes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.erro" class="colab-detail-page__error">
      <h2>😕 Solicitação não encontrada</h2>
      <p>{{ store.erro }}</p>
      <router-link to="/colaboracoes" class="colab-detail-page__back-link">← Voltar às colaborações</router-link>
    </div>

    <!-- Content -->
    <template v-else-if="colab">
      <header class="colab-detail-page__header">
        <router-link to="/colaboracoes" class="colab-detail-page__voltar">← Voltar às colaborações</router-link>

        <div class="colab-detail-page__badges">
          <span class="colab-detail-page__urgencia" :style="{ background: urgenciaInfo.cor }">
            {{ urgenciaIcon }} {{ urgenciaInfo.label }}
          </span>
          <span class="colab-detail-page__status" :style="{ color: statusInfo.cor, borderColor: statusInfo.cor }">
            {{ statusInfo.label }}
          </span>
        </div>

        <h1 class="colab-detail-page__title">{{ colab.titulo }}</h1>

        <div class="colab-detail-page__meta">
          <span class="colab-detail-page__meta-item">
            <strong>Publicado por:</strong> {{ colab.autor }} · {{ colab.cursoOrigem }}
          </span>
          <span class="colab-detail-page__meta-item">
            <strong>Orientador:</strong> {{ colab.orientador }}
          </span>
          <span class="colab-detail-page__meta-item">
            <strong>Data:</strong> {{ formatarData(colab.dataCriacao) }}
          </span>
          <span class="colab-detail-page__meta-item">
            <strong>Área:</strong> {{ colab.area }}
          </span>
        </div>
      </header>

      <div class="colab-detail-page__content">
        <!-- Imagem -->
        <div v-if="colab.imagemUrl" class="colab-detail-page__img-wrap">
          <img :src="colab.imagemUrl" :alt="colab.titulo" class="colab-detail-page__img" />
        </div>

        <!-- Descrição -->
        <section class="colab-detail-page__section">
          <h2 class="colab-detail-page__section-title">📝 Descrição do Projeto</h2>
          <p class="colab-detail-page__descricao">{{ colab.descricao }}</p>
        </section>

        <!-- Cursos Desejados -->
        <section class="colab-detail-page__section">
          <h2 class="colab-detail-page__section-title">🎯 Cursos Solicitados</h2>
          <div class="colab-detail-page__cursos">
            <span
              v-for="curso in colab.cursosDesejados"
              :key="curso"
              class="colab-detail-page__curso-pill"
            >
              {{ curso }}
            </span>
          </div>
        </section>

        <!-- Competências -->
        <section v-if="colab.competenciasNecessarias.length > 0" class="colab-detail-page__section">
          <h2 class="colab-detail-page__section-title">💡 Competências Necessárias</h2>
          <div class="colab-detail-page__competencias">
            <span
              v-for="comp in colab.competenciasNecessarias"
              :key="comp"
              class="colab-detail-page__comp-tag"
            >
              {{ comp }}
            </span>
          </div>
        </section>

        <!-- Ações do Autor -->
        <section v-if="isAutor" class="colab-detail-page__section colab-detail-page__author-actions">
          <h2 class="colab-detail-page__section-title">⚙️ Gerenciar Solicitação</h2>
          <div class="colab-detail-page__actions-row">
            <select v-model="novoStatus" class="colab-detail-page__status-select" @change="alterarStatus">
              <option value="aberta">Aberta</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <button class="colab-detail-page__btn-danger" @click="confirmarExclusao">
              Excluir solicitação
            </button>
          </div>
        </section>

        <!-- Interesse -->
        <section v-if="!isAutor" class="colab-detail-page__section colab-detail-page__interesse-section">
          <h2 class="colab-detail-page__section-title">🤝 Quer colaborar?</h2>
          <InteresseButton :colaboracao-id="colab.id" />
        </section>

      </div>
    </template>

    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="modal-overlay"
        role="presentation"
        @click.self="fecharModalExclusao"
      >
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-colab-title"
          aria-describedby="delete-colab-desc"
        >
          <div class="modal-icon" aria-hidden="true">!</div>
          <h2 id="delete-colab-title">Excluir solicitação de colaboração?</h2>
          <p id="delete-colab-desc">
            Esta ação remove a solicitação e a lista de interessados. Ela não pode ser desfeita.
          </p>
          <div class="modal-actions">
            <button type="button" class="modal-btn modal-btn--danger" id="btn-confirm-delete-colab" @click="excluirColaboracao">
              Sim, excluir
            </button>
            <button type="button" class="modal-btn modal-btn--outline" id="btn-cancel-delete-colab" @click="fecharModalExclusao">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useColaboracaoStore } from '@/stores/colaboracao.store';
import { useToastStore } from '@/stores/toast.store';
import { URGENCIA_LABELS, STATUS_LABELS } from '@/data/mockColaboracoes';
import InteresseButton from '@/components/common/InteresseButton.vue';

const route = useRoute();
const router = useRouter();
const store = useColaboracaoStore();
const toastStore = useToastStore();

const colab = computed(() => store.colaboracaoSelecionada);
const isAutor = computed(() => {
  if (!colab.value) return false;
  return store.usuarioEhAutor(colab.value.id);
});

const novoStatus = ref('');
const showDeleteModal = ref(false);

const urgenciaInfo = computed(() => {
  if (!colab.value) return URGENCIA_LABELS.baixa;
  return URGENCIA_LABELS[colab.value.urgencia] || URGENCIA_LABELS.baixa;
});

const statusInfo = computed(() => {
  if (!colab.value) return STATUS_LABELS.aberta;
  return STATUS_LABELS[colab.value.status] || STATUS_LABELS.aberta;
});

const urgenciaIcon = computed(() => {
  if (!colab.value) return '🟢';
  const icons: Record<string, string> = { baixa: '🟢', media: '🟡', alta: '🔴' };
  return icons[colab.value.urgencia] || '🟢';
});

const formatarData = (data: Date | string) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const carregarDados = async () => {
  const id = route.params.id as string;
  await store.buscarPorId(id);
  if (colab.value) {
    novoStatus.value = colab.value.status;
  }
};

const alterarStatus = () => {
  if (!colab.value) return;
  const ok = store.atualizarStatus(colab.value.id, novoStatus.value as any);
  if (ok) {
    toastStore.notificar('Status atualizado com sucesso!', 'success');
  }
};

const confirmarExclusao = async () => {
  if (!colab.value) return;
  showDeleteModal.value = true;
};

const fecharModalExclusao = () => {
  showDeleteModal.value = false;
};

const excluirColaboracao = async () => {
  if (!colab.value) return;

  const ok = await store.deletarColaboracao(colab.value.id);
  if (ok) {
    showDeleteModal.value = false;
    toastStore.notificar('Solicitação de colaboração excluída.', 'info');
    router.push('/colaboracoes');
  } else {
    toastStore.notificar(store.erro || 'Não foi possível excluir a solicitação. Tente novamente.', 'danger');
  }
};

onMounted(carregarDados);

watch(() => route.params.id, carregarDados);
</script>

<style scoped>
.colab-detail-page {
  padding: 2rem 0;
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

/* Loading & Error */
.colab-detail-page__loading,
.colab-detail-page__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  text-align: center;
}

.colab-detail-page__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.colab-detail-page__back-link {
  color: var(--accent);
  font-weight: 500;
  text-decoration: none;
}

/* Header */
.colab-detail-page__header {
  margin-bottom: 2rem;
}

.colab-detail-page__voltar {
  font-size: 0.85rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;
  transition: opacity 0.15s;
}

.colab-detail-page__voltar:hover {
  opacity: 0.7;
}

.colab-detail-page__badges {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.colab-detail-page__urgencia {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.colab-detail-page__status {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border: 1.5px solid;
  border-radius: 20px;
}

.colab-detail-page__title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 1rem;
  letter-spacing: -0.4px;
  line-height: 1.3;
}

.colab-detail-page__meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.colab-detail-page__meta-item {
  font-size: 0.85rem;
  color: var(--text);
}

.colab-detail-page__meta-item strong {
  color: var(--text);
}

/* Content */
.colab-detail-page__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.colab-detail-page__img-wrap {
  border-radius: 16px;
  overflow: hidden;
  max-height: 350px;
}

.colab-detail-page__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.colab-detail-page__section {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.colab-detail-page__section:last-child {
  border-bottom: none;
}

.colab-detail-page__section-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.75rem;
}

.colab-detail-page__descricao {
  font-size: 0.95rem;
  color: var(--text);
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
}

/* Cursos */
.colab-detail-page__cursos {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.colab-detail-page__curso-pill {
  padding: 0.4rem 1rem;
  border-radius: 25px;
  font-size: 0.88rem;
  font-weight: 600;
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid var(--primary-border);
}

/* Competências */
.colab-detail-page__competencias {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.colab-detail-page__comp-tag {
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  font-size: 0.82rem;
  background: var(--surface-2);
  color: var(--text);
  font-weight: 500;
}

/* Author Actions */
.colab-detail-page__author-actions {
  background: var(--accent-light);
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  padding: 1.25rem !important;
}

.colab-detail-page__actions-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.colab-detail-page__status-select {
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.85rem;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  font-family: var(--font-body);
}

.colab-detail-page__btn-danger {
  padding: 0.5rem 1rem;
  border: 1px solid var(--danger);
  border-radius: 8px;
  background: transparent;
  color: var(--danger);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  font-family: var(--font-body);
}

.colab-detail-page__btn-danger:hover {
  background: var(--danger-light);
}

/* Interesse Section */
.colab-detail-page__interesse-section {
  background: linear-gradient(135deg, var(--accent-light), var(--primary-light));
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  padding: 1.25rem !important;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--overlay);
  backdrop-filter: blur(4px);
}

.modal-card {
  width: min(100%, 430px);
  padding: 1.6rem;
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.modal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-bottom: 0.8rem;
  border-radius: 50%;
  background: var(--danger-light);
  color: var(--danger);
  font-size: 1.3rem;
  font-weight: 900;
}

.modal-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
}

.modal-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.2rem;
}

.modal-btn {
  min-height: 42px;
  padding: 0.65rem 1.1rem;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.modal-btn--danger {
  border: 1px solid var(--danger);
  background: var(--danger);
  color: var(--on-danger);
}

.modal-btn--outline {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.modal-btn--outline:hover {
  border-color: var(--accent);
  background: var(--accent-light);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .colab-detail-page__title {
    font-size: 1.4rem;
  }

  .colab-detail-page__actions-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

