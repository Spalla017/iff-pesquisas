<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="hero-copy reveal">
        <span class="badge">Acervo de extensão do IFF Itaperuna</span>
        <h1>Pesquisas do campus em um acervo público, pesquisável e organizado.</h1>
        <p>
          Consulte projetos por área, autor, orientador ou palavra-chave e acompanhe a produção
          acadêmica desenvolvida pela comunidade do Instituto Federal Fluminense.
        </p>

        <form class="hero-search" @submit.prevent="explorarBusca">
          <label class="sr-only" for="home-search">Buscar pesquisas</label>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            id="home-search"
            v-model="busca"
            type="search"
            placeholder="Buscar por título, tema ou palavra-chave"
          />
          <button class="btn btn-primary" type="submit">Buscar</button>
        </form>

        <div class="hero-actions">
          <router-link to="/feed" class="btn btn-outline">Explorar acervo</router-link>
          <router-link to="/criar-post" class="btn btn-primary">Publicar pesquisa</router-link>
        </div>
      </div>

      <aside class="hero-panel reveal reveal-delay-1" aria-label="Resumo do acervo">
        <div class="panel-header">
          <span class="panel-kicker">Panorama</span>
          <strong>{{ totalPesquisasAnimado }} pesquisas catalogadas</strong>
        </div>
        <div class="metric-grid">
          <div class="metric">
            <strong>{{ totalAreasAnimado }}</strong>
            <span>áreas</span>
          </div>
          <div class="metric">
            <strong>{{ pesquisasComPdfAnimado }}</strong>
            <span>com PDF</span>
          </div>
          <div class="metric">
            <strong>{{ pesquisaMaisRecente }}</strong>
            <span>última publicação</span>
          </div>
        </div>
        <div class="featured-mini">
          <span class="panel-kicker">Destaque recente</span>
          <h2>{{ destaque.titulo }}</h2>
          <p>{{ destaque.resumo }}</p>
          <router-link :to="`/pesquisa/${destaque.id}`" class="inline-link">
            Ver detalhes
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </aside>
    </section>

    <section class="home-section reveal reveal-delay-2">
      <div class="section-heading">
        <div>
          <span class="badge">Publicações recentes</span>
          <h2>Últimas pesquisas no acervo</h2>
        </div>
        <router-link to="/feed" class="btn btn-outline btn-sm">Ver todas</router-link>
      </div>

      <div class="recent-grid">
        <PesquisaCard
          v-for="pesquisa in pesquisasRecentes"
          :key="pesquisa.id"
          :pesquisa="pesquisa"
        />
      </div>
    </section>

    <section class="home-section colab-cta-section reveal reveal-delay-2">
      <div class="colab-cta">
        <div class="colab-cta__content">
          <span class="badge">Novo</span>
          <h2>Colaboração entre Cursos</h2>
          <p>
            Seu projeto precisa de conhecimentos de outro curso? Publique uma solicitação de
            colaboração e conecte-se com alunos de Administração, Mecânica, Automação Industrial e outros cursos do campus.
          </p>
          <div class="colab-cta__actions">
            <router-link to="/colaboracoes" class="btn btn-primary">Explorar colaborações</router-link>
            <router-link to="/solicitar-colaboracao" class="btn btn-outline">Solicitar ajuda</router-link>
          </div>
        </div>
        <div class="colab-cta__visual">
          <div class="colab-cta__icon">🤝</div>
          <div class="colab-cta__courses">
            <span class="colab-cta__course">SI</span>
            <span class="colab-cta__arrow">↔</span>
            <span class="colab-cta__course">ADM</span>
            <span class="colab-cta__arrow">↔</span>
            <span class="colab-cta__course">MEC</span>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section area-section reveal reveal-delay-3">
      <div class="section-heading">
        <div>
          <span class="badge">Navegação por área</span>
          <h2>Encontre projetos pelo campo de conhecimento</h2>
        </div>
      </div>

      <div class="area-grid">
        <router-link
          v-for="area in areasComTotais"
          :key="area.nome"
          :to="{ path: '/feed', query: { area: area.nome } }"
          class="area-item"
        >
          <span>{{ area.nome }}</span>
          <strong>{{ area.total }}</strong>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import PesquisaCard from '@/components/common/PesquisaCard.vue';
import { AREAS_DISPONIVEIS, mockPesquisas } from '@/data/mockPesquisas';

const router = useRouter();
const busca = ref('');
const totalPesquisasAnimado = ref(0);
const totalAreasAnimado = ref(0);
const pesquisasComPdfAnimado = ref(0);

const pesquisasOrdenadas = computed(() =>
  [...mockPesquisas].sort(
    (a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime(),
  ),
);

const destaque = computed(() => pesquisasOrdenadas.value[0]);
const pesquisasRecentes = computed(() => pesquisasOrdenadas.value.slice(0, 4));
const totalPesquisas = computed(() => mockPesquisas.length);
const totalAreas = computed(() => new Set(mockPesquisas.map((p) => p.area)).size);
const pesquisasComPdf = computed(() => mockPesquisas.filter((p) => p.pdfUrl).length);
const pesquisaMaisRecente = computed(() =>
  new Date(destaque.value.dataPublicacao).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  }),
);

const areasComTotais = computed(() =>
  AREAS_DISPONIVEIS.map((nome) => ({
    nome,
    total: mockPesquisas.filter((pesquisa) => pesquisa.area === nome).length,
  })).filter((area) => area.total > 0),
);

const explorarBusca = () => {
  const termo = busca.value.trim();
  router.push({
    path: '/feed',
    query: termo ? { q: termo } : undefined,
  });
};

const animarNumero = (alvo: Ref<number>, valorFinal: number) => {
  const duracao = 850;
  const inicio = performance.now();

  const atualizar = (agora: number) => {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const suavizado = 1 - Math.pow(1 - progresso, 3);
    alvo.value = Math.round(valorFinal * suavizado);

    if (progresso < 1) {
      requestAnimationFrame(atualizar);
    }
  };

  requestAnimationFrame(atualizar);
};

onMounted(() => {
  animarNumero(totalPesquisasAnimado, totalPesquisas.value);
  animarNumero(totalAreasAnimado, totalAreas.value);
  animarNumero(pesquisasComPdfAnimado, pesquisasComPdf.value);
});
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(360px, 0.82fr);
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.1rem;
  min-height: 520px;
  padding: 3rem 0;
}

.hero-copy h1 {
  max-width: 760px;
  margin: 0;
}

.hero-copy p {
  max-width: 660px;
  margin: 0;
  font-size: 1rem;
}

.hero-search {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  max-width: 720px;
  padding: 0.45rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.hero-search svg {
  margin-left: 0.6rem;
  color: var(--muted);
}

.hero-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--text);
  font: inherit;
  background: transparent;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero-panel {
  display: flex;
  flex-direction: column;
  justify-self: center;
  width: min(100%, 430px);
  gap: 1.15rem;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.panel-header strong {
  font-family: var(--font-display);
  font-size: 1.18rem;
  line-height: 1.25;
}

.panel-kicker {
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 92px;
  gap: 0.25rem;
  padding: 0.8rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-align: center;
}

.metric strong {
  color: var(--primary);
  font-family: var(--font-display);
  font-size: 1.25rem;
  line-height: 1.15;
}

.metric span {
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 600;
}

.featured-mini {
  display: grid;
  gap: 0.4rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.featured-mini h2 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.28;
}

.featured-mini p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.inline-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  width: fit-content;
  color: var(--primary);
  font-size: 0.86rem;
  font-weight: 800;
}

.home-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.section-heading h2 {
  margin: 0.35rem 0 0;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.area-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.area-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text);
  font-weight: 700;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.area-item:hover {
  color: var(--primary);
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.area-item strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  color: var(--primary);
  background: var(--primary-light);
  border-radius: var(--radius-md);
}

/* Collaboration CTA */
.colab-cta {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
  align-items: center;
  padding: 2rem 2.5rem;
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.06), rgba(170, 59, 255, 0.06));
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.colab-cta__content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.colab-cta__content h2 {
  margin: 0;
  font-size: 1.3rem;
}

.colab-cta__content p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text);
}

.colab-cta__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.colab-cta__visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.colab-cta__icon {
  font-size: 3rem;
}

.colab-cta__courses {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.colab-cta__course {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--text-h);
  transition: transform 0.2s, border-color 0.2s;
}

.colab-cta:hover .colab-cta__course {
  border-color: var(--primary);
  transform: scale(1.08);
}

.colab-cta__arrow {
  color: var(--muted);
  font-size: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1024px) {
  .home-hero {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    min-height: auto;
    padding: 2rem 0 0;
  }

  .hero-panel {
    justify-self: stretch;
    width: 100%;
  }

  .area-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .hero-search {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .hero-search .btn {
    grid-column: 1 / -1;
    width: 100%;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .metric-grid,
  .recent-grid,
  .area-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .colab-cta {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .colab-cta__actions {
    flex-direction: column;
  }

  .colab-cta__actions .btn {
    width: 100%;
  }
}
</style>
