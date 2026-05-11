<template>
  <div class="criar-solicitacao-page">
    <header class="criar-solicitacao-page__header">
      <router-link to="/colaboracoes" class="criar-solicitacao-page__voltar">← Voltar às colaborações</router-link>
      <h1 class="criar-solicitacao-page__title">Solicitar Colaboração</h1>
      <p class="criar-solicitacao-page__subtitle">
        Descreva seu projeto e indique de quais cursos você precisa de ajuda.
      </p>
    </header>

    <form class="criar-solicitacao-page__form" @submit.prevent="handleSubmit">
      <!-- Título -->
      <div class="form-group">
        <label for="titulo" class="form-label">Título do Projeto *</label>
        <input
          id="titulo"
          v-model="form.titulo"
          type="text"
          class="form-input"
          :class="{ 'form-input--erro': erros.titulo }"
          placeholder="Ex: Sistema de Gestão para Cooperativa Agrícola"
          maxlength="150"
        />
        <span v-if="erros.titulo" class="form-erro">{{ erros.titulo }}</span>
        <span class="form-hint">{{ form.titulo.length }}/150 caracteres</span>
      </div>

      <!-- Descrição -->
      <div class="form-group">
        <label for="descricao" class="form-label">Descrição Detalhada *</label>
        <textarea
          id="descricao"
          v-model="form.descricao"
          class="form-textarea"
          :class="{ 'form-input--erro': erros.descricao }"
          placeholder="Descreva o projeto, o que já foi feito, e que tipo de ajuda você precisa..."
          rows="6"
          maxlength="1000"
        />
        <span v-if="erros.descricao" class="form-erro">{{ erros.descricao }}</span>
        <span class="form-hint">{{ form.descricao.length }}/1000 caracteres</span>
      </div>

      <!-- Curso de Origem (auto) -->
      <div class="form-group">
        <label class="form-label">Seu Curso</label>
        <div class="form-static">
          <span class="curso-badge curso-badge--origem">{{ cursoOrigem }}</span>
          <span class="form-hint-inline">Identificado automaticamente pelo seu perfil</span>
        </div>
      </div>

      <!-- Cursos Desejados -->
      <div class="form-group">
        <label class="form-label">De quais cursos você precisa de ajuda? *</label>
        <div class="form-checkboxes" :class="{ 'form-input--erro': erros.cursosDesejados }">
          <label
            v-for="curso in cursosDisponiveis"
            :key="curso"
            class="form-checkbox"
            :class="{ 'form-checkbox--disabled': curso === cursoOrigem }"
          >
            <input
              type="checkbox"
              :value="curso"
              :disabled="curso === cursoOrigem"
              :checked="form.cursosDesejados.includes(curso)"
              @change="toggleCurso(curso)"
            />
            <span class="form-checkbox__mark" />
            <span>{{ curso }}</span>
          </label>
        </div>
        <span v-if="erros.cursosDesejados" class="form-erro">{{ erros.cursosDesejados }}</span>
      </div>

      <!-- Área + Urgência (row) -->
      <div class="form-row">
        <div class="form-group">
          <label for="area" class="form-label">Área de Conhecimento *</label>
          <select
            id="area"
            v-model="form.area"
            class="form-select"
            :class="{ 'form-input--erro': erros.area }"
          >
            <option value="" disabled>Selecione uma área</option>
            <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
          </select>
          <span v-if="erros.area" class="form-erro">{{ erros.area }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">Urgência *</label>
          <div class="form-radios" :class="{ 'form-input--erro': erros.urgencia }">
            <label class="form-radio">
              <input type="radio" v-model="form.urgencia" value="baixa" />
              <span class="form-radio__mark" />
              <span>🟢 Baixa</span>
            </label>
            <label class="form-radio">
              <input type="radio" v-model="form.urgencia" value="media" />
              <span class="form-radio__mark" />
              <span>🟡 Média</span>
            </label>
            <label class="form-radio">
              <input type="radio" v-model="form.urgencia" value="alta" />
              <span class="form-radio__mark" />
              <span>🔴 Alta</span>
            </label>
          </div>
          <span v-if="erros.urgencia" class="form-erro">{{ erros.urgencia }}</span>
        </div>
      </div>

      <!-- Orientador -->
      <div class="form-group">
        <label for="orientador" class="form-label">Orientador *</label>
        <input
          id="orientador"
          v-model="form.orientador"
          type="text"
          class="form-input"
          :class="{ 'form-input--erro': erros.orientador }"
          placeholder="Nome do professor orientador"
        />
        <span v-if="erros.orientador" class="form-erro">{{ erros.orientador }}</span>
      </div>

      <!-- Competências -->
      <div class="form-group">
        <label for="competencia-input" class="form-label">Competências Necessárias</label>
        <div class="form-tags-wrap">
          <div class="form-tags">
            <span
              v-for="(comp, idx) in form.competenciasNecessarias"
              :key="idx"
              class="form-tag"
            >
              {{ comp }}
              <button type="button" class="form-tag__remove" @click="removerCompetencia(idx)">✕</button>
            </span>
          </div>
          <div class="form-tag-input-wrap" v-if="form.competenciasNecessarias.length < 8">
            <input
              id="competencia-input"
              v-model="competenciaInput"
              type="text"
              class="form-input form-input--sm"
              placeholder="Ex: Gestão financeira"
              @keydown.enter.prevent="adicionarCompetencia"
            />
            <button type="button" class="form-tag-add" @click="adicionarCompetencia">+ Adicionar</button>
          </div>
          <span class="form-hint">{{ form.competenciasNecessarias.length }}/8 competências. Pressione Enter para adicionar.</span>
        </div>
      </div>

      <!-- Imagem -->
      <div class="form-group">
        <label class="form-label">Imagem Ilustrativa (Opcional)</label>
        <div
          class="form-dropzone"
          :class="{ 'form-dropzone--active': dragActive }"
          @dragenter.prevent="dragActive = true"
          @dragleave.prevent="dragActive = false"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input
            type="file"
            accept="image/*"
            class="form-dropzone__input"
            @change="handleFileChange"
          />
          <div v-if="!imagemPreview" class="form-dropzone__placeholder">
            <span class="form-dropzone__icon">📷</span>
            <span>Arraste uma imagem ou clique para selecionar</span>
          </div>
          <div v-else class="form-dropzone__preview">
            <img :src="imagemPreview" alt="Preview" />
            <button type="button" class="form-dropzone__remove" @click.stop="removerImagem">✕ Remover</button>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="form-actions">
        <button type="submit" class="form-submit" :disabled="store.carregando">
          <span v-if="store.carregando" class="form-submit__spinner" />
          {{ store.carregando ? 'Publicando...' : '🚀 Publicar Solicitação' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useColaboracaoStore } from '@/stores/colaboracao.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { createColaboracaoSchema, extrairErroZod } from '@/schemas';
import { CURSOS_DISPONIVEIS } from '@/data/mockColaboracoes';
import { AREAS_DISPONIVEIS } from '@/data/mockPesquisas';

const router = useRouter();
const store = useColaboracaoStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const cursosDisponiveis = CURSOS_DISPONIVEIS;
const areas = AREAS_DISPONIVEIS;

const cursoOrigem = computed(() => authStore.usuario?.curso || 'Sistemas de Informação');

const form = reactive({
  titulo: '',
  descricao: '',
  cursosDesejados: [] as string[],
  orientador: '',
  area: '',
  urgencia: '' as string,
  competenciasNecessarias: [] as string[],
});

const erros = reactive<Record<string, string>>({});
const competenciaInput = ref('');
const imagemFile = ref<File | null>(null);
const imagemPreview = ref('');
const dragActive = ref(false);

// Limpar erros individuais reativamente ao preencher campos
watch(() => form.titulo, () => { if (erros.titulo) delete erros.titulo; });
watch(() => form.descricao, () => { if (erros.descricao) delete erros.descricao; });
watch(() => form.cursosDesejados, () => { if (erros.cursosDesejados) delete erros.cursosDesejados; }, { deep: true });
watch(() => form.area, () => { if (erros.area) delete erros.area; });
watch(() => form.urgencia, () => { if (erros.urgencia) delete erros.urgencia; });
watch(() => form.orientador, () => { if (erros.orientador) delete erros.orientador; });

const toggleCurso = (curso: string) => {
  const idx = form.cursosDesejados.indexOf(curso);
  if (idx >= 0) {
    form.cursosDesejados.splice(idx, 1);
  } else {
    form.cursosDesejados.push(curso);
  }
};

const adicionarCompetencia = () => {
  const valor = competenciaInput.value.trim();
  if (!valor || form.competenciasNecessarias.length >= 8) return;
  if (form.competenciasNecessarias.includes(valor)) return;
  form.competenciasNecessarias.push(valor);
  competenciaInput.value = '';
};

const removerCompetencia = (idx: number) => {
  form.competenciasNecessarias.splice(idx, 1);
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    setImagem(target.files[0]);
  }
};

const handleDrop = (e: DragEvent) => {
  dragActive.value = false;
  if (e.dataTransfer?.files?.[0]) {
    setImagem(e.dataTransfer.files[0]);
  }
};

const setImagem = (file: File) => {
  imagemFile.value = file;
  if (imagemPreview.value) URL.revokeObjectURL(imagemPreview.value);
  imagemPreview.value = URL.createObjectURL(file);
};

const removerImagem = () => {
  if (imagemPreview.value) URL.revokeObjectURL(imagemPreview.value);
  imagemFile.value = null;
  imagemPreview.value = '';
};

onUnmounted(() => {
  if (imagemPreview.value) URL.revokeObjectURL(imagemPreview.value);
});

const limparErros = () => {
  Object.keys(erros).forEach(k => delete erros[k]);
};

const handleSubmit = async () => {
  limparErros();

  const validacao = createColaboracaoSchema.safeParse(form);
  if (!validacao.success) {
    validacao.error.issues.forEach(issue => {
      const campo = issue.path[0] as string;
      if (!erros[campo]) erros[campo] = issue.message;
    });
    toastStore.notificar(extrairErroZod(validacao) || 'Corrija os erros no formulário.', 'danger');
    return;
  }

  const ok = await store.criarColaboracao({
    ...validacao.data,
    imagem: imagemFile.value,
  });

  if (ok) {
    toastStore.notificar('Solicitação publicada com sucesso! 🎉', 'success');
    router.push('/colaboracoes');
  } else {
    toastStore.notificar(store.erro || 'Erro ao publicar solicitação.', 'danger');
  }
};
</script>

<style scoped>
.criar-solicitacao-page {
  padding: 2rem 0;
  max-width: 720px;
  margin: 0 auto;
  text-align: left;
}

.criar-solicitacao-page__header {
  margin-bottom: 2rem;
}

.criar-solicitacao-page__voltar {
  font-size: 0.85rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 0.75rem;
  transition: opacity 0.15s;
}

.criar-solicitacao-page__voltar:hover {
  opacity: 0.7;
}

.criar-solicitacao-page__title {
  font-family: var(--heading);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-h);
  margin: 0 0 0.5rem;
  letter-spacing: -0.4px;
}

.criar-solicitacao-page__subtitle {
  color: var(--text);
  font-size: 0.92rem;
  margin: 0;
  line-height: 1.5;
}

.criar-solicitacao-page__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form Elements */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-h);
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.7rem 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.9rem;
  background: var(--bg);
  color: var(--text-h);
  font-family: var(--sans);
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  width: 100%;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.form-input--erro {
  border-color: #ef4444 !important;
}

.form-input--sm {
  padding: 0.5rem 0.8rem;
  font-size: 0.85rem;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-hint {
  font-size: 0.72rem;
  color: var(--text);
  opacity: 0.5;
}

.form-hint-inline {
  font-size: 0.78rem;
  color: var(--text);
  opacity: 0.5;
}

.form-erro {
  font-size: 0.78rem;
  color: #ef4444;
  font-weight: 500;
}

.form-static {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* Checkboxes */
.form-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.88rem;
  color: var(--text-h);
}

.form-checkbox--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.form-checkbox input {
  accent-color: var(--accent);
  width: 16px;
  height: 16px;
}

/* Radios */
.form-radios {
  display: flex;
  gap: 1.5rem;
}

.form-radio {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-size: 0.88rem;
  color: var(--text-h);
}

.form-radio input {
  accent-color: var(--accent);
}

/* Tags */
.form-tags-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.form-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 20px;
  border: 1px solid var(--accent-border);
}

.form-tag__remove {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 0.7rem;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.form-tag__remove:hover {
  opacity: 1;
}

.form-tag-input-wrap {
  display: flex;
  gap: 0.5rem;
}

.form-tag-add {
  padding: 0.5rem 1rem;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: transparent;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  font-family: var(--sans);
  white-space: nowrap;
}

.form-tag-add:hover {
  background: var(--accent-bg);
}

/* Course Badge */
.curso-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
}

.curso-badge--origem {
  background: var(--accent-bg);
  color: var(--accent);
  border: 1px solid var(--accent-border);
}

/* Dropzone */
.form-dropzone {
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}

.form-dropzone:hover,
.form-dropzone--active {
  border-color: var(--accent);
  background: var(--accent-bg);
}

.form-dropzone__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.form-dropzone__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  font-size: 0.88rem;
}

.form-dropzone__icon {
  font-size: 2rem;
}

.form-dropzone__preview {
  position: relative;
}

.form-dropzone__preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.form-dropzone__remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-size: 0.78rem;
  cursor: pointer;
  z-index: 1;
}

/* Submit */
.form-actions {
  padding-top: 0.5rem;
}

.form-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: var(--sans);
}

.form-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(170, 59, 255, 0.3);
}

.form-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-submit__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-radios {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
