<template>
  <div class="create-page">
    <!-- Header -->
    <section class="page-header reveal">
      <div>
        <div class="header-badges">
          <span class="badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Nova publicação
          </span>
        </div>
        <h1>Publicar pesquisa</h1>
        <p>Dê visibilidade ao seu trabalho acadêmico com um cadastro completo e organizado.</p>
      </div>
    </section>

    <!-- Success Alert -->
    <div v-if="publicadoComSucesso" class="alert alert-success scale-in">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Pesquisa publicada com sucesso! Redirecionando...
    </div>

    <!-- Error Alert -->
    <div v-if="erroPublicacao" class="alert alert-danger scale-in">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      {{ erroPublicacao }}
    </div>

    <div class="create-grid reveal reveal-delay-1">
      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="form-card card" id="create-post-form">
        <!-- Título -->
        <div class="form-group">
          <label class="form-label" for="titulo">
            Título da pesquisa <span class="required">*</span>
          </label>
          <input
            id="titulo"
            v-model="form.titulo"
            type="text"
            class="form-input"
            required
            placeholder="Ex: Impacto da IoT na agricultura familiar"
            maxlength="200"
          />
          <span class="form-hint">{{ form.titulo.length }}/200 caracteres</span>
        </div>

        <!-- Resumo -->
        <div class="form-group">
          <label class="form-label" for="resumo">
            Resumo <span class="required">*</span>
          </label>
          <textarea
            id="resumo"
            v-model="form.resumo"
            class="form-textarea"
            required
            placeholder="Descreva brevemente o objetivo, metodologia e resultados da pesquisa..."
            maxlength="500"
            rows="5"
          ></textarea>
          <span class="form-hint">{{ form.resumo.length }}/500 caracteres</span>
        </div>

        <!-- Área e Orientador -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="area">
              Área de conhecimento <span class="required">*</span>
            </label>
            <select id="area" v-model="form.area" class="form-select" required>
              <option value="">Selecione uma área</option>
              <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="orientador">
              Orientador <span class="required">*</span>
            </label>
            <input
              id="orientador"
              v-model="form.orientador"
              type="text"
              class="form-input"
              required
              placeholder="Prof. Dr. Nome Completo"
            />
          </div>
        </div>

        <!-- Palavras-chave -->
        <div class="form-group">
          <label class="form-label" for="palavras-chave">Palavras-chave</label>
          <div class="keywords-input">
            <div class="keywords-tags">
              <span v-for="(kw, idx) in form.palavrasChave" :key="idx" class="keyword-tag">
                {{ kw }}
                <button type="button" @click="removerPalavraChave(idx)" class="keyword-remove" aria-label="Remover palavra-chave">×</button>
              </span>
            </div>
            <input
              id="palavras-chave"
              v-model="novaPalavraChave"
              type="text"
              class="form-input"
              placeholder="Digite e pressione Enter..."
              @keydown.enter.prevent="adicionarPalavraChave"
            />
          </div>
          <span class="form-hint">Pressione Enter para adicionar (máx. 5)</span>
        </div>

        <!-- Upload PDF -->
        <div class="form-group">
          <label class="form-label">Arquivo PDF</label>
          <div
            class="upload-zone"
            :class="{ 'upload-active': isDraggingPdf, 'upload-filled': form.pdf }"
            @dragover.prevent="isDraggingPdf = true"
            @dragleave="isDraggingPdf = false"
            @drop.prevent="handlePdfDrop"
            id="upload-pdf-zone"
          >
            <input
              type="file"
              accept=".pdf"
              @change="handlePdfSelect"
              class="upload-input"
              id="pdf-input"
            />
            <div v-if="!form.pdf" class="upload-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9,15 12,12 15,15"/>
              </svg>
              <span>Arraste o PDF aqui ou <strong>clique para selecionar</strong></span>
              <span class="form-hint">Máximo 50MB</span>
            </div>
            <div v-else class="upload-preview">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              <div class="upload-file-info">
                <strong>{{ form.pdf.name }}</strong>
                <span class="form-hint">{{ formatFileSize(form.pdf.size) }}</span>
              </div>
              <button type="button" @click.stop="form.pdf = null" class="upload-remove" aria-label="Remover PDF">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Upload Imagem -->
        <div class="form-group">
          <label class="form-label">Imagem de capa</label>
          <div
            class="upload-zone"
            :class="{ 'upload-active': isDraggingImg, 'upload-filled': form.imagem }"
            @dragover.prevent="isDraggingImg = true"
            @dragleave="isDraggingImg = false"
            @drop.prevent="handleImageDrop"
            id="upload-img-zone"
          >
            <input
              type="file"
              accept="image/*"
              @change="handleImageSelect"
              class="upload-input"
              id="img-input"
            />
            <div v-if="!form.imagem" class="upload-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <span>Arraste uma imagem ou <strong>clique para selecionar</strong></span>
              <span class="form-hint">Recomendado: 800×500px · JPEG ou PNG</span>
            </div>
            <div v-else class="upload-preview">
              <img :src="imagemPreviewUrl" alt="Preview" class="img-preview" />
              <div class="upload-file-info">
                <strong>{{ form.imagem.name }}</strong>
                <span class="form-hint">{{ formatFileSize(form.imagem.size) }}</span>
              </div>
              <button type="button" @click.stop="removerImagem" class="upload-remove" aria-label="Remover imagem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="enviando" class="upload-progress">
          <div class="progress-info">
            <span>Publicando pesquisa...</span>
            <span>{{ progressoUpload }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: progressoUpload + '%' }"></div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="submit" :disabled="enviando || !formValido" class="btn btn-primary btn-lg" id="btn-publish">
            <svg v-if="!enviando" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            <span v-if="enviando" class="btn-spinner"></span>
            {{ enviando ? 'Publicando...' : 'Publicar pesquisa' }}
          </button>
          <router-link to="/feed" class="btn btn-outline" id="btn-cancel-create">Cancelar</router-link>
        </div>
      </form>

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="card tips-card">
          <div class="tips-icon">💡</div>
          <h3>Boas práticas</h3>
          <ul class="tips-list">
            <li>
              <strong>Título objetivo</strong>
              <span>Use palavras-chave no título para facilitar a busca.</span>
            </li>
            <li>
              <strong>Resumo completo</strong>
              <span>Inclua objetivo, metodologia e principais resultados.</span>
            </li>
            <li>
              <strong>Imagem de destaque</strong>
              <span>Posts com imagem recebem mais visualizações.</span>
            </li>
            <li>
              <strong>Revise antes</strong>
              <span>Confirme os dados com seu orientador antes de publicar.</span>
            </li>
          </ul>
        </div>

        <div class="card checklist-card">
          <h3>Checklist</h3>
          <div class="check-items">
            <div class="check-item" :class="{ checked: form.titulo.length > 0 }">
              <span class="check-icon">{{ form.titulo.length > 0 ? '✓' : '○' }}</span>
              Título preenchido
            </div>
            <div class="check-item" :class="{ checked: form.resumo.length > 0 }">
              <span class="check-icon">{{ form.resumo.length > 0 ? '✓' : '○' }}</span>
              Resumo preenchido
            </div>
            <div class="check-item" :class="{ checked: form.area !== '' }">
              <span class="check-icon">{{ form.area !== '' ? '✓' : '○' }}</span>
              Área selecionada
            </div>
            <div class="check-item" :class="{ checked: form.orientador.length > 0 }">
              <span class="check-icon">{{ form.orientador.length > 0 ? '✓' : '○' }}</span>
              Orientador informado
            </div>
            <div class="check-item" :class="{ checked: form.pdf !== null }">
              <span class="check-icon">{{ form.pdf !== null ? '✓' : '○' }}</span>
              PDF anexado
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { usePesquisaStore } from '@/stores/pesquisa.store';
import { AREAS_DISPONIVEIS } from '@/data/mockPesquisas';

const router = useRouter();
const pesquisaStore = usePesquisaStore();

const areas = AREAS_DISPONIVEIS;
const enviando = ref(false);
const publicadoComSucesso = ref(false);
const erroPublicacao = ref('');
const progressoUpload = ref(0);
const novaPalavraChave = ref('');
const isDraggingPdf = ref(false);
const isDraggingImg = ref(false);
const imagemPreviewUrl = ref('');

const form = ref({
  titulo: '',
  resumo: '',
  area: '',
  orientador: '',
  palavrasChave: [] as string[],
  pdf: null as File | null,
  imagem: null as File | null,
});

const formValido = computed(() =>
  form.value.titulo.trim() !== '' &&
  form.value.resumo.trim() !== '' &&
  form.value.area !== '' &&
  form.value.orientador.trim() !== ''
);

// Keywords
const adicionarPalavraChave = () => {
  const kw = novaPalavraChave.value.trim();
  const jaExiste = form.value.palavrasChave.some(
    palavra => palavra.toLocaleLowerCase('pt-BR') === kw.toLocaleLowerCase('pt-BR'),
  );

  if (kw && form.value.palavrasChave.length < 5 && !jaExiste) {
    form.value.palavrasChave.push(kw);
    novaPalavraChave.value = '';
  }
};

const removerPalavraChave = (idx: number) => {
  form.value.palavrasChave.splice(idx, 1);
};

// File handling
const handlePdfSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    setPdf(input.files[0]);
  }
};

const handlePdfDrop = (event: DragEvent) => {
  isDraggingPdf.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    setPdf(file);
  }
};

const setPdf = (file: File) => {
  if (file.type !== 'application/pdf') {
    erroPublicacao.value = 'Selecione um arquivo no formato PDF.';
    return;
  }

  if (file.size > 50 * 1024 * 1024) {
    erroPublicacao.value = 'O arquivo PDF deve ter no máximo 50MB.';
    return;
  }

  form.value.pdf = file;
  erroPublicacao.value = '';
};

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    setImagem(input.files[0]);
  }
};

const handleImageDrop = (event: DragEvent) => {
  isDraggingImg.value = false;
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    setImagem(file);
  }
};

const setImagem = (file: File) => {
  if (!file.type.startsWith('image/')) {
    erroPublicacao.value = 'Selecione uma imagem válida.';
    return;
  }

  if (imagemPreviewUrl.value) {
    URL.revokeObjectURL(imagemPreviewUrl.value);
  }

  form.value.imagem = file;
  imagemPreviewUrl.value = URL.createObjectURL(file);
  erroPublicacao.value = '';
};

const removerImagem = () => {
  if (imagemPreviewUrl.value) {
    URL.revokeObjectURL(imagemPreviewUrl.value);
  }
  form.value.imagem = null;
  imagemPreviewUrl.value = '';
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Submit
const handleSubmit = async () => {
  if (!formValido.value) return;

  enviando.value = true;
  erroPublicacao.value = '';
  progressoUpload.value = 0;

  // Simulate upload progress
  const progressInterval = setInterval(() => {
    if (progressoUpload.value < 90) {
      progressoUpload.value += Math.random() * 15;
    }
  }, 200);

  try {
    const sucesso = await pesquisaStore.criarPesquisa({
      titulo: form.value.titulo,
      resumo: form.value.resumo,
      area: form.value.area,
      orientador: form.value.orientador,
      palavrasChave: form.value.palavrasChave,
      pdf: form.value.pdf,
      imagem: form.value.imagem,
    });

    clearInterval(progressInterval);
    progressoUpload.value = 100;

    if (sucesso) {
      publicadoComSucesso.value = true;
      setTimeout(() => {
        router.push('/feed');
      }, 1500);
    } else {
      erroPublicacao.value = 'Erro ao publicar pesquisa. Tente novamente.';
    }
  } catch {
    clearInterval(progressInterval);
    erroPublicacao.value = 'Erro inesperado ao publicar. Tente novamente.';
  } finally {
    enviando.value = false;
  }
};

onBeforeUnmount(() => {
  if (imagemPreviewUrl.value) {
    URL.revokeObjectURL(imagemPreviewUrl.value);
  }
});
</script>

<style scoped>
.create-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-badges {
  margin-bottom: 0.3rem;
}

.page-header h1 {
  margin: 0;
}

.page-header p {
  max-width: 520px;
}

.create-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

/* Form */
.form-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.required {
  color: var(--danger);
}

/* Keywords Input */
.keywords-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.keywords-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.keyword-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  background: var(--accent-light);
  color: var(--accent-2);
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 600;
}

.keyword-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font-size: 1.1rem;
  line-height: 1;
  opacity: 0.6;
  padding: 0;
}

.keyword-remove:hover {
  opacity: 1;
}

/* Upload Zones */
.upload-zone {
  position: relative;
  border: 2px dashed var(--border-strong);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.upload-zone:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.upload-active {
  border-color: var(--primary);
  background: rgba(28, 47, 99, 0.06);
  transform: scale(1.01);
}

.upload-filled {
  border-style: solid;
  border-color: var(--success);
  background: var(--success-light);
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.88rem;
  pointer-events: none;
}

.upload-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  pointer-events: none;
}

.upload-file-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.upload-file-info strong {
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-remove {
  pointer-events: auto;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  color: var(--danger);
  border-radius: 50%;
  display: flex;
  transition: background var(--transition-fast);
  z-index: 2;
}

.upload-remove:hover {
  background: var(--danger-light);
}

.img-preview {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

/* Progress */
.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--muted);
  font-weight: 500;
}

.progress-track {
  height: 6px;
  background: var(--bg-strong);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  border-radius: var(--radius-pill);
  transition: width 0.3s ease;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
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

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 80px;
}

.tips-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
}

.tips-icon {
  font-size: 1.5rem;
}

.tips-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tips-list li {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.tips-list li strong {
  font-size: 0.85rem;
  color: var(--text);
}

.tips-list li span {
  font-size: 0.8rem;
  color: var(--muted);
}

/* Checklist */
.checklist-card {
  padding: 1.5rem;
}

.check-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--muted);
  transition: color var(--transition-fast);
}

.check-item.checked {
  color: var(--success);
}

.check-icon {
  font-size: 0.9rem;
  width: 18px;
  text-align: center;
}

@media (max-width: 1024px) {
  .create-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
