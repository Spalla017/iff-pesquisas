<template>
  <div class="create-page">
    <!-- Header -->
    <section class="page-header reveal">
      <div>
        <div class="header-badges">
          <span class="badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            {{ isEdicao ? 'Edição de publicação' : 'Nova publicação' }}
          </span>
        </div>
        <h1>{{ isEdicao ? 'Editar pesquisa' : 'Publicar pesquisa' }}</h1>
        <p>{{ isEdicao ? 'Atualize as informações da sua publicação acadêmica.' : 'Dê visibilidade ao seu trabalho acadêmico com um cadastro completo e organizado.' }}</p>
      </div>
    </section>

    <!-- Success Alert -->
    <div v-if="publicadoComSucesso" class="alert alert-success scale-in">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Pesquisa {{ isEdicao ? 'atualizada' : 'publicada' }} com sucesso! Redirecionando...
    </div>

    <!-- Error Alert -->
    <div v-if="erroPublicacao" class="alert alert-danger scale-in" role="alert" aria-live="assertive">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      {{ erroPublicacao }}
    </div>

    <div class="create-grid reveal reveal-delay-1">
      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="form-card card" id="create-post-form" novalidate>
        <div v-if="errosResumo.length" class="form-error-summary" role="alert" aria-live="assertive">
          <h2>Revise os campos antes de publicar</h2>
          <p>Encontramos informações que precisam ser corrigidas:</p>
          <ul>
            <li v-for="item in errosResumo" :key="item.campo">
              <button type="button" class="form-error-summary__link" @click="focarCampoErro(item.campo)">
                {{ item.mensagem }}
              </button>
            </li>
          </ul>
        </div>

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
            :class="{ 'form-input--erro': erros.titulo }"
            placeholder="Ex: Impacto da IoT na agricultura familiar"
            maxlength="200"
            :aria-invalid="!!erros.titulo"
            :aria-describedby="erros.titulo ? 'titulo-erro titulo-hint' : 'titulo-hint'"
          />
          <span v-if="erros.titulo" id="titulo-erro" class="form-error">{{ erros.titulo }}</span>
          <span id="titulo-hint" class="form-hint">{{ form.titulo.length }}/200 caracteres</span>
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
            :class="{ 'form-input--erro': erros.resumo }"
            placeholder="Descreva brevemente o objetivo, metodologia e resultados da pesquisa..."
            maxlength="500"
            rows="5"
            :aria-invalid="!!erros.resumo"
            :aria-describedby="erros.resumo ? 'resumo-erro resumo-hint' : 'resumo-hint'"
          ></textarea>
          <span v-if="erros.resumo" id="resumo-erro" class="form-error">{{ erros.resumo }}</span>
          <span id="resumo-hint" class="form-hint">{{ form.resumo.length }}/500 caracteres</span>
        </div>

        <!-- Área e Orientador -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="area">
              Área de conhecimento <span class="required">*</span>
            </label>
            <select
              id="area"
              v-model="form.area"
              class="form-select"
              :class="{ 'form-input--erro': erros.area }"
              :aria-invalid="!!erros.area"
              :aria-describedby="erros.area ? 'area-erro' : undefined"
            >
              <option value="">Selecione uma área</option>
              <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
            </select>
            <span v-if="erros.area" id="area-erro" class="form-error">{{ erros.area }}</span>
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
              :class="{ 'form-input--erro': erros.orientador }"
              placeholder="Prof. Dr. Nome Completo"
              :aria-invalid="!!erros.orientador"
              :aria-describedby="erros.orientador ? 'orientador-erro' : undefined"
            />
            <span v-if="erros.orientador" id="orientador-erro" class="form-error">{{ erros.orientador }}</span>
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
              aria-describedby="palavras-chave-hint palavras-chave-aviso"
              @input="palavraChaveAviso = ''"
              @keydown.enter.prevent="adicionarPalavraChave"
            />
          </div>
          <span id="palavras-chave-hint" class="form-hint">Pressione Enter para adicionar (máx. 5)</span>
          <span v-if="palavraChaveAviso" id="palavras-chave-aviso" class="form-error" aria-live="polite">{{ palavraChaveAviso }}</span>
        </div>

        <!-- Upload PDF -->
        <div class="form-group">
          <label class="form-label">Arquivo PDF</label>
          <div
            class="upload-zone"
            :class="{ 'upload-active': isDraggingPdf, 'upload-filled': form.pdf, 'form-input--erro': erros.pdf }"
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
              :aria-invalid="!!erros.pdf"
              :aria-describedby="erros.pdf ? 'pdf-erro pdf-hint' : 'pdf-hint'"
            />
            <div v-if="!form.pdf" class="upload-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9,15 12,12 15,15"/>
              </svg>
              <span>Arraste o PDF aqui ou <strong>clique para selecionar</strong></span>
              <span id="pdf-hint" class="form-hint">Máximo 50MB</span>
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
          <span v-if="erros.pdf" id="pdf-erro" class="form-error">{{ erros.pdf }}</span>
        </div>

        <!-- Upload Imagem -->
        <div class="form-group">
          <label class="form-label">Imagem de capa</label>
          <div
            class="upload-zone"
            :class="{ 'upload-active': isDraggingImg, 'upload-filled': imagemPreviewUrl, 'form-input--erro': erros.imagem }"
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
              :aria-invalid="!!erros.imagem"
              :aria-describedby="erros.imagem ? 'imagem-erro imagem-hint' : 'imagem-hint'"
            />
            <div v-if="!imagemPreviewUrl" class="upload-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <span>Arraste uma imagem ou <strong>clique para selecionar</strong></span>
              <span id="imagem-hint" class="form-hint">Recomendado: 800×500px · JPEG ou PNG, até 5MB</span>
            </div>
            <div v-else class="upload-preview">
              <img :src="imagemPreviewUrl" alt="Preview" class="img-preview" />
              <div class="upload-file-info">
                <strong>{{ form.imagem?.name || 'Imagem atual da pesquisa' }}</strong>
                <span class="form-hint">{{ form.imagem ? formatFileSize(form.imagem.size) : 'Pré-visualização atual' }}</span>
              </div>
              <button type="button" @click.stop="removerImagem" class="upload-remove" aria-label="Remover imagem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
          <span v-if="erros.imagem" id="imagem-erro" class="form-error">{{ erros.imagem }}</span>
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
          <button type="submit" :disabled="enviando" class="btn btn-primary btn-lg" id="btn-publish" :aria-busy="enviando">
            <svg v-if="!enviando" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            <span v-if="enviando" class="btn-spinner"></span>
            {{ textoBotaoSubmit }}
          </button>
          <router-link :to="isEdicao ? '/meus-posts' : '/feed'" class="btn btn-outline" id="btn-cancel-create">Cancelar</router-link>
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
              <span>Publicações com imagem ajudam a contextualizar a pesquisa.</span>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { usePesquisaStore } from '@/stores/pesquisa.store';
import { AREAS_DISPONIVEIS } from '@/data/mockPesquisas';
import { createPostSchema, extrairErroZod } from '@/schemas';

const router = useRouter();
const route = useRoute();
const pesquisaStore = usePesquisaStore();

const areas = AREAS_DISPONIVEIS;
const enviando = ref(false);
const publicadoComSucesso = ref(false);
const erroPublicacao = ref('');
const progressoUpload = ref(0);
const novaPalavraChave = ref('');
const palavraChaveAviso = ref('');
const isDraggingPdf = ref(false);
const isDraggingImg = ref(false);
const imagemPreviewUrl = ref('');
const imagemRemovida = ref(false);
const snapshotInicial = ref('');
const erros = ref<Record<string, string>>({});
const camposErro: Record<string, { id: string; label: string }> = {
  titulo: { id: 'titulo', label: 'Título da pesquisa' },
  resumo: { id: 'resumo', label: 'Resumo' },
  area: { id: 'area', label: 'Área de conhecimento' },
  orientador: { id: 'orientador', label: 'Orientador' },
  pdf: { id: 'pdf-input', label: 'Arquivo PDF' },
  imagem: { id: 'img-input', label: 'Imagem de capa' },
};
const ordemCamposErro = Object.keys(camposErro);

const form = ref({
  titulo: '',
  resumo: '',
  area: '',
  orientador: '',
  palavrasChave: [] as string[],
  pdf: null as File | null,
  imagem: null as File | null,
});

const errosResumo = computed(() =>
  ordemCamposErro
    .filter(campo => erros.value[campo])
    .map(campo => ({
      campo,
      label: camposErro[campo].label,
      mensagem: erros.value[campo],
    })),
);
const serializarForm = () => JSON.stringify({
  titulo: form.value.titulo,
  resumo: form.value.resumo,
  area: form.value.area,
  orientador: form.value.orientador,
  palavrasChave: form.value.palavrasChave,
  imagemPreviewUrl: imagemPreviewUrl.value,
  imagemRemovida: imagemRemovida.value,
});
const formAlterado = computed(() =>
  serializarForm() !== snapshotInicial.value ||
  form.value.pdf !== null ||
  form.value.imagem !== null
);
const deveConfirmarSaida = () =>
  formAlterado.value &&
  !publicadoComSucesso.value &&
  !enviando.value;

const postId = computed(() => typeof route.params.id === 'string' ? route.params.id : '');
const isEdicao = computed(() => route.name === 'EditPost' && !!postId.value);
const pesquisaEmEdicao = computed(() =>
  postId.value ? pesquisaStore.todasPesquisas.find(pesquisa => pesquisa.id === postId.value) : undefined
);
const textoBotaoSubmit = computed(() => {
  if (enviando.value) {
    return isEdicao.value ? 'Salvando...' : 'Publicando...';
  }

  return isEdicao.value ? 'Salvar alterações' : 'Publicar pesquisa';
});

watch(() => form.value.titulo, () => { delete erros.value.titulo; });
watch(() => form.value.resumo, () => { delete erros.value.resumo; });
watch(() => form.value.area, () => { delete erros.value.area; });
watch(() => form.value.orientador, () => { delete erros.value.orientador; });

// Keywords
const adicionarPalavraChave = () => {
  const kw = novaPalavraChave.value.trim();
  palavraChaveAviso.value = '';
  const jaExiste = form.value.palavrasChave.some(
    palavra => palavra.toLocaleLowerCase('pt-BR') === kw.toLocaleLowerCase('pt-BR'),
  );

  if (!kw) {
    return;
  }

  if (form.value.palavrasChave.length >= 5) {
    palavraChaveAviso.value = 'Informe no máximo 5 palavras-chave.';
    return;
  }

  if (jaExiste) {
    palavraChaveAviso.value = 'Esta palavra-chave já foi adicionada.';
    return;
  }

  form.value.palavrasChave.push(kw);
  novaPalavraChave.value = '';
};

const removerPalavraChave = (idx: number) => {
  form.value.palavrasChave.splice(idx, 1);
};

// File handling
const handlePdfSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    const pdfAceito = setPdf(input.files[0]);
    if (!pdfAceito) input.value = '';
  }
};

const handlePdfDrop = (event: DragEvent) => {
  isDraggingPdf.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    setPdf(file);
  }
};

const setPdf = (file: File): boolean => {
  if (file.type !== 'application/pdf') {
    erros.value.pdf = 'O arquivo deve estar em formato PDF.';
    erroPublicacao.value = erros.value.pdf;
    return false;
  }

  if (file.size > 50 * 1024 * 1024) {
    erros.value.pdf = 'O arquivo PDF deve ter no máximo 50MB.';
    erroPublicacao.value = erros.value.pdf;
    return false;
  }

  form.value.pdf = file;
  erroPublicacao.value = '';
  delete erros.value.pdf;
  return true;
};

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    const imagemAceita = setImagem(input.files[0]);
    if (!imagemAceita) input.value = '';
  }
};

const handleImageDrop = (event: DragEvent) => {
  isDraggingImg.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    setImagem(file);
  }
};

const setImagem = (file: File): boolean => {
  const tiposAceitos = ['image/jpeg', 'image/png'];
  if (!tiposAceitos.includes(file.type)) {
    erros.value.imagem = 'A imagem deve estar em formato JPEG ou PNG.';
    erroPublicacao.value = erros.value.imagem;
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    erros.value.imagem = 'A imagem deve ter no máximo 5MB.';
    erroPublicacao.value = erros.value.imagem;
    return false;
  }

  if (imagemPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagemPreviewUrl.value);
  }

  form.value.imagem = file;
  imagemPreviewUrl.value = URL.createObjectURL(file);
  imagemRemovida.value = false;
  erroPublicacao.value = '';
  delete erros.value.imagem;
  return true;
};

const removerImagem = () => {
  if (imagemPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagemPreviewUrl.value);
  }
  form.value.imagem = null;
  imagemPreviewUrl.value = '';
  imagemRemovida.value = true;
  delete erros.value.imagem;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Submit
const handleSubmit = async () => {
  erros.value = {};

  const dadosValidados = createPostSchema.safeParse({
    titulo: form.value.titulo.trim(),
    resumo: form.value.resumo.trim(),
    area: form.value.area,
    orientador: form.value.orientador.trim(),
    palavrasChave: form.value.palavrasChave,
  });

  if (!dadosValidados.success) {
    dadosValidados.error.issues.forEach(issue => {
      const campo = issue.path[0] as string;
      if (!erros.value[campo]) erros.value[campo] = issue.message;
    });
    erroPublicacao.value = extrairErroZod(dadosValidados) ?? 'Corrija os campos destacados.';
    focarPrimeiroCampoComErro();
    return;
  }

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
    const payload = {
      ...dadosValidados.data,
      pdf: form.value.pdf,
      imagem: form.value.imagem,
    };

    const sucesso = isEdicao.value
      ? await pesquisaStore.atualizarPesquisa(postId.value, {
        ...payload,
        removerImagem: imagemRemovida.value,
      })
      : await pesquisaStore.criarPesquisa(payload);

    clearInterval(progressInterval);
    progressoUpload.value = 100;

    if (sucesso) {
      publicadoComSucesso.value = true;
      setTimeout(() => {
        router.push(isEdicao.value ? '/meus-posts' : '/feed');
      }, 1500);
    } else {
      erroPublicacao.value = isEdicao.value
        ? 'Erro ao atualizar pesquisa. Tente novamente.'
        : 'Erro ao publicar pesquisa. Tente novamente.';
    }
  } catch {
    clearInterval(progressInterval);
    erroPublicacao.value = 'Erro inesperado ao publicar. Tente novamente.';
  } finally {
    enviando.value = false;
  }
};

const focarCampoErro = (campo: string) => {
  const id = camposErro[campo]?.id;
  if (!id) return;

  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.focus();
    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const focarPrimeiroCampoComErro = () => {
  const primeiroCampo = errosResumo.value[0]?.campo;
  if (!primeiroCampo) return;
  window.requestAnimationFrame(() => focarCampoErro(primeiroCampo));
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!deveConfirmarSaida()) return;

  event.preventDefault();
  event.returnValue = '';
};

snapshotInicial.value = serializarForm();

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);

  if (!isEdicao.value) return;

  const pesquisa = pesquisaEmEdicao.value;
  if (!pesquisa) {
    erroPublicacao.value = 'Pesquisa não encontrada para edição.';
    return;
  }

  form.value = {
    titulo: pesquisa.titulo,
    resumo: pesquisa.resumo,
    area: pesquisa.area,
    orientador: pesquisa.orientador,
    palavrasChave: [...(pesquisa.palavrasChave || [])],
    pdf: null,
    imagem: null,
  };
  imagemPreviewUrl.value = pesquisa.imagemUrl || '';
  imagemRemovida.value = false;
  snapshotInicial.value = serializarForm();
});

onBeforeRouteLeave(() => {
  if (!deveConfirmarSaida()) return true;

  return window.confirm('Descartar alterações não salvas?');
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);

  if (imagemPreviewUrl.value.startsWith('blob:')) {
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

.form-error-summary {
  padding: 1rem;
  border: 1px solid var(--danger-border);
  border-radius: var(--radius-md);
  background: var(--danger-light);
}

.form-error-summary h2 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.form-error-summary p {
  margin: 0 0 0.5rem;
  color: var(--muted);
  font-size: 0.86rem;
}

.form-error-summary ul {
  margin: 0;
  padding-left: 1rem;
}

.form-error-summary__link {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--danger);
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.form-error-summary__link:hover,
.form-error-summary__link:focus {
  text-decoration: underline;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.required {
  color: var(--danger);
}

.form-error {
  color: var(--danger);
  font-size: 0.78rem;
  font-weight: 700;
}

.form-input--erro {
  border-color: var(--danger) !important;
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
  background: var(--primary-light);
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
