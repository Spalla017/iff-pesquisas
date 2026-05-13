<template>
  <div class="criar-solicitacao-page">
    <header class="criar-solicitacao-page__header">
      <router-link to="/colaboracoes" class="criar-solicitacao-page__voltar">← Voltar às colaborações</router-link>
      <h1 class="criar-solicitacao-page__title">Solicitação de colaboração</h1>
      <p id="form-intro" class="criar-solicitacao-page__subtitle">
        Informe o projeto, os cursos desejados e as competências necessárias para receber apoio interdisciplinar.
      </p>
    </header>

    <form class="criar-solicitacao-page__form" aria-describedby="form-intro" novalidate @submit.prevent="handleSubmit">
      <div
        v-if="errosResumo.length"
        class="form-error-summary"
        role="alert"
        aria-live="assertive"
        tabindex="-1"
      >
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
        <label for="titulo" class="form-label">Título do projeto *</label>
        <input
          id="titulo"
          v-model="form.titulo"
          type="text"
          class="form-input"
          :class="{ 'form-input--erro': erros.titulo }"
          placeholder="Ex: Sistema de Gestão para Cooperativa Agrícola"
          maxlength="150"
          :aria-invalid="!!erros.titulo"
          :aria-describedby="erros.titulo ? 'titulo-erro titulo-hint' : 'titulo-hint'"
        />
        <span v-if="erros.titulo" id="titulo-erro" class="form-erro">{{ erros.titulo }}</span>
        <span id="titulo-hint" :class="['form-hint', obterClasseContador(form.titulo.length, 150)]">{{ form.titulo.length }}/150 caracteres</span>
      </div>

      <!-- Descrição -->
      <div class="form-group">
        <label for="descricao" class="form-label">Descrição detalhada *</label>
        <textarea
          id="descricao"
          v-model="form.descricao"
          class="form-textarea"
          :class="{ 'form-input--erro': erros.descricao }"
          placeholder="Descreva o projeto, o que já foi feito e que tipo de apoio interdisciplinar você precisa."
          rows="6"
          maxlength="1000"
          :aria-invalid="!!erros.descricao"
          :aria-describedby="erros.descricao ? 'descricao-erro descricao-hint' : 'descricao-hint'"
        />
        <span v-if="erros.descricao" id="descricao-erro" class="form-erro">{{ erros.descricao }}</span>
        <span id="descricao-hint" :class="['form-hint', obterClasseContador(form.descricao.length, 1000)]">{{ form.descricao.length }}/1000 caracteres</span>
      </div>

      <!-- Curso de Origem (auto) -->
      <div class="form-group">
        <span class="form-label">Curso de origem</span>
        <div class="form-static">
          <span class="curso-badge curso-badge--origem">{{ cursoOrigem }}</span>
          <span class="form-hint-inline">Identificado automaticamente pelo seu perfil</span>
        </div>
      </div>

      <!-- Cursos Desejados -->
      <div class="form-group">
        <span id="cursos-desejados-label" class="form-label">Cursos desejados para colaboração *</span>
        <div
          id="cursos-desejados"
          class="form-checkboxes"
          :class="{ 'form-input--erro': erros.cursosDesejados }"
          role="group"
          tabindex="-1"
          aria-labelledby="cursos-desejados-label"
          :aria-invalid="!!erros.cursosDesejados"
          :aria-describedby="erros.cursosDesejados ? 'cursos-desejados-erro cursos-desejados-hint' : 'cursos-desejados-hint'"
        >
          <label
            v-for="(curso, index) in cursosDisponiveis"
            :key="curso"
            class="form-checkbox"
            :class="{ 'form-checkbox--disabled': curso === cursoOrigem }"
          >
            <input
              :id="`curso-${index}`"
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
        <span id="cursos-desejados-hint" class="form-hint">Selecione ao menos um curso diferente do seu curso de origem.</span>
        <span v-if="erros.cursosDesejados" id="cursos-desejados-erro" class="form-erro">{{ erros.cursosDesejados }}</span>
      </div>

      <!-- Área + Urgência (row) -->
      <div class="form-row">
        <div class="form-group">
          <label for="area" class="form-label">Área de conhecimento *</label>
          <select
            id="area"
            v-model="form.area"
            class="form-select"
            :class="{ 'form-input--erro': erros.area }"
            :aria-invalid="!!erros.area"
            :aria-describedby="erros.area ? 'area-erro' : undefined"
          >
            <option value="" disabled>Selecione uma área</option>
            <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
          </select>
          <span v-if="erros.area" id="area-erro" class="form-erro">{{ erros.area }}</span>
        </div>

        <div class="form-group">
          <span id="urgencia-label" class="form-label">Urgência *</span>
          <div
            id="urgencia"
            class="form-radios"
            :class="{ 'form-input--erro': erros.urgencia }"
            role="radiogroup"
            aria-labelledby="urgencia-label"
            :aria-invalid="!!erros.urgencia"
            :aria-describedby="erros.urgencia ? 'urgencia-erro' : undefined"
          >
            <label class="form-radio">
              <input id="urgencia-baixa" type="radio" v-model="form.urgencia" name="urgencia" value="baixa" />
              <span class="form-radio__mark" />
              <span>Baixa</span>
            </label>
            <label class="form-radio">
              <input type="radio" v-model="form.urgencia" name="urgencia" value="media" />
              <span class="form-radio__mark" />
              <span>Média</span>
            </label>
            <label class="form-radio">
              <input type="radio" v-model="form.urgencia" name="urgencia" value="alta" />
              <span class="form-radio__mark" />
              <span>Alta</span>
            </label>
          </div>
          <span v-if="erros.urgencia" id="urgencia-erro" class="form-erro">{{ erros.urgencia }}</span>
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
          autocomplete="name"
          :aria-invalid="!!erros.orientador"
          :aria-describedby="erros.orientador ? 'orientador-erro' : undefined"
        />
        <span v-if="erros.orientador" id="orientador-erro" class="form-erro">{{ erros.orientador }}</span>
      </div>

      <!-- Competências -->
      <div class="form-group">
        <label for="competencia-input" class="form-label">Competências necessárias</label>
        <div class="form-tags-wrap">
          <div class="form-tags">
            <span
              v-for="(comp, idx) in form.competenciasNecessarias"
              :key="idx"
              class="form-tag"
            >
              {{ comp }}
              <button type="button" class="form-tag__remove" :aria-label="`Remover competência ${comp}`" @click="removerCompetencia(idx)">✕</button>
            </span>
          </div>
          <div class="form-tag-input-wrap" v-if="form.competenciasNecessarias.length < 8">
            <input
              id="competencia-input"
              v-model="competenciaInput"
              type="text"
              class="form-input form-input--sm"
              placeholder="Ex: Gestão financeira"
              aria-describedby="competencia-hint competencia-aviso"
              @input="competenciaAviso = ''"
              @keydown.enter.prevent="adicionarCompetencia"
            />
            <button type="button" class="form-tag-add" @click="adicionarCompetencia">+ Adicionar</button>
          </div>
          <span id="competencia-hint" class="form-hint">{{ form.competenciasNecessarias.length }}/8 competências. Pressione Enter para adicionar.</span>
          <span v-if="competenciaAviso" id="competencia-aviso" class="form-erro" aria-live="polite">{{ competenciaAviso }}</span>
        </div>
      </div>

      <!-- Imagem -->
      <div class="form-group">
        <label for="imagem-input" class="form-label">Imagem ilustrativa opcional</label>
        <div
          class="form-dropzone"
          :class="{ 'form-dropzone--active': dragActive, 'form-dropzone--erro': erros.imagem }"
          @dragenter.prevent="dragActive = true"
          @dragleave.prevent="dragActive = false"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input
            id="imagem-input"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="form-dropzone__input"
            :aria-invalid="!!erros.imagem"
            :aria-describedby="erros.imagem ? 'imagem-erro imagem-hint' : 'imagem-hint'"
            @change="handleFileChange"
          />
          <div v-if="!imagemPreview" class="form-dropzone__placeholder">
            <span>Arraste uma imagem ou clique para selecionar</span>
            <span class="form-hint">Formatos aceitos: JPG, PNG ou WebP, até 5 MB.</span>
          </div>
          <div v-else class="form-dropzone__preview">
            <img :src="imagemPreview" alt="Pré-visualização da imagem ilustrativa da solicitação" />
            <button type="button" class="form-dropzone__remove" @click.stop="removerImagem">✕ Remover</button>
          </div>
        </div>
        <span id="imagem-hint" class="form-hint">A imagem é opcional e deve ter até 5 MB.</span>
        <span v-if="erros.imagem" id="imagem-erro" class="form-erro">{{ erros.imagem }}</span>
      </div>

      <!-- Submit -->
      <div class="form-actions">
        <router-link to="/colaboracoes" class="form-cancel">Cancelar</router-link>
        <button type="submit" class="form-submit" :disabled="store.carregando" :aria-busy="store.carregando">
          <span v-if="store.carregando" class="form-submit__spinner" />
          {{ store.carregando ? 'Publicando solicitação...' : 'Publicar solicitação' }}
        </button>
        <p v-if="store.carregando" class="sr-only" aria-live="polite">Publicando solicitação de colaboração.</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, watch } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useColaboracaoStore } from '@/stores/colaboracao.store';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { createColaboracaoSchema, extrairErroZod } from '@/schemas';
import { CURSOS_IFF, AREAS_CONHECIMENTO } from '@/data/catalogos';

const router = useRouter();
const store = useColaboracaoStore();
const authStore = useAuthStore();
const toastStore = useToastStore();

const cursosDisponiveis = CURSOS_IFF;
const areas = AREAS_CONHECIMENTO;
const permitirSaidaSemConfirmacao = ref(false);
const tiposImagemAceitos = ['image/jpeg', 'image/png', 'image/webp'];
const tamanhoMaximoImagemMb = 5;
const tamanhoMaximoImagemBytes = tamanhoMaximoImagemMb * 1024 * 1024;
const camposErro: Record<string, { id: string; label: string }> = {
  titulo: { id: 'titulo', label: 'Título do projeto' },
  descricao: { id: 'descricao', label: 'Descrição detalhada' },
  cursosDesejados: { id: 'cursos-desejados', label: 'Cursos desejados para colaboração' },
  area: { id: 'area', label: 'Área de conhecimento' },
  urgencia: { id: 'urgencia-baixa', label: 'Urgência' },
  orientador: { id: 'orientador', label: 'Orientador' },
  imagem: { id: 'imagem-input', label: 'Imagem ilustrativa' },
};
const ordemCamposErro = Object.keys(camposErro);

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
const competenciaAviso = ref('');
const imagemFile = ref<File | null>(null);
const imagemPreview = ref('');
const dragActive = ref(false);

const formularioSujo = computed(() => (
  form.titulo.trim().length > 0 ||
  form.descricao.trim().length > 0 ||
  form.cursosDesejados.length > 0 ||
  form.orientador.trim().length > 0 ||
  form.area.trim().length > 0 ||
  form.urgencia.trim().length > 0 ||
  form.competenciasNecessarias.length > 0 ||
  !!imagemFile.value
));

const errosResumo = computed(() =>
  ordemCamposErro
    .filter(campo => erros[campo])
    .map(campo => ({
      campo,
      label: camposErro[campo].label,
      mensagem: erros[campo],
    })),
);

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
  competenciaAviso.value = '';

  if (!valor || form.competenciasNecessarias.length >= 8) return;

  const jaAdicionada = form.competenciasNecessarias.some(
    competencia => competencia.toLowerCase() === valor.toLowerCase(),
  );

  if (jaAdicionada) {
    competenciaAviso.value = 'Esta competência já foi adicionada.';
    return;
  }

  form.competenciasNecessarias.push(valor);
  competenciaInput.value = '';
};

const removerCompetencia = (idx: number) => {
  form.competenciasNecessarias.splice(idx, 1);
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    const imagemAceita = setImagem(target.files[0]);
    if (!imagemAceita) {
      target.value = '';
    }
  }
};

const handleDrop = (e: DragEvent) => {
  dragActive.value = false;
  if (e.dataTransfer?.files?.[0]) {
    setImagem(e.dataTransfer.files[0]);
  }
};

const validarImagem = (file: File): string | null => {
  if (!tiposImagemAceitos.includes(file.type)) {
    return 'A imagem deve estar em formato JPG, PNG ou WebP.';
  }

  if (file.size > tamanhoMaximoImagemBytes) {
    return `A imagem deve ter no máximo ${tamanhoMaximoImagemMb} MB.`;
  }

  return null;
};

const setImagem = (file: File): boolean => {
  const erroImagem = validarImagem(file);
  if (erroImagem) {
    erros.imagem = erroImagem;
    toastStore.notificar(erroImagem, 'warning');
    return false;
  }

  delete erros.imagem;
  imagemFile.value = file;
  if (imagemPreview.value) URL.revokeObjectURL(imagemPreview.value);
  imagemPreview.value = URL.createObjectURL(file);
  return true;
};

const removerImagem = () => {
  if (imagemPreview.value) URL.revokeObjectURL(imagemPreview.value);
  imagemFile.value = null;
  imagemPreview.value = '';
  delete erros.imagem;
};

onUnmounted(() => {
  if (imagemPreview.value) URL.revokeObjectURL(imagemPreview.value);
});

const limparErros = () => {
  Object.keys(erros).forEach(k => delete erros[k]);
};

const obterClasseContador = (atual: number, limite: number) => {
  const percentual = atual / limite;
  if (percentual >= 0.95) return 'form-hint--danger';
  if (percentual >= 0.8) return 'form-hint--warning';
  return '';
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

const handleSubmit = async () => {
  limparErros();

  const validacao = createColaboracaoSchema.safeParse(form);
  if (!validacao.success) {
    validacao.error.issues.forEach(issue => {
      const campo = issue.path[0] as string;
      if (!erros[campo]) erros[campo] = issue.message;
    });
    toastStore.notificar(extrairErroZod(validacao) || 'Corrija os erros no formulário.', 'danger');
    focarPrimeiroCampoComErro();
    return;
  }

  const ok = await store.criarColaboracao({
    ...validacao.data,
    imagem: imagemFile.value,
  });

  if (ok) {
    permitirSaidaSemConfirmacao.value = true;
    toastStore.notificar('Solicitação publicada com sucesso! 🎉', 'success');
    router.push('/colaboracoes');
  } else {
    toastStore.notificar(store.erro || 'Não foi possível publicar a solicitação. Tente novamente.', 'danger');
  }
};

onBeforeRouteLeave(() => {
  if (permitirSaidaSemConfirmacao.value || !formularioSujo.value) {
    return true;
  }

  return window.confirm('Você possui alterações não salvas. Deseja sair mesmo assim?');
});
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
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text);
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

.form-error-summary {
  padding: 1rem;
  border: 1px solid var(--danger-border);
  border-radius: 10px;
  background: var(--danger-light);
  color: var(--text);
}

.form-error-summary h2 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.form-error-summary p {
  margin: 0 0 0.5rem;
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
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.form-error-summary__link:hover,
.form-error-summary__link:focus {
  text-decoration: underline;
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
  color: var(--text);
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.7rem 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.9rem;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  width: 100%;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--ring);
}

.form-input--erro {
  border-color: var(--danger) !important;
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

.form-hint--warning {
  color: var(--warning);
  opacity: 0.85;
}

.form-hint--danger {
  color: var(--danger);
  opacity: 1;
}

.form-hint-inline {
  font-size: 0.78rem;
  color: var(--text);
  opacity: 0.5;
}

.form-erro {
  font-size: 0.78rem;
  color: var(--danger);
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
  color: var(--text);
}

.form-checkbox--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.form-checkbox input {
  accent-color: var(--primary);
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
  color: var(--text);
}

.form-radio input {
  accent-color: var(--primary);
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
  background: var(--accent-light);
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 20px;
  border: 1px solid var(--border-strong);
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
  border: 1px solid var(--primary);
  border-radius: 8px;
  background: transparent;
  color: var(--primary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  font-family: var(--font-body);
  white-space: nowrap;
}

.form-tag-add:hover {
  background: var(--primary-light);
}

/* Course Badge */
.curso-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
}

.curso-badge--origem {
  background: var(--accent-light);
  color: var(--accent);
  border: 1px solid var(--border-strong);
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
  border-color: var(--primary);
  background: var(--primary-light);
}

.form-dropzone--erro {
  border-color: var(--danger);
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
  background: var(--overlay-strong);
  color: var(--footer-text);
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.form-cancel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.7rem 1.4rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}

.form-cancel:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.form-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: var(--on-primary);
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: var(--font-body);
}

.form-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px var(--primary-shadow);
}

.form-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-submit__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-strong);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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


