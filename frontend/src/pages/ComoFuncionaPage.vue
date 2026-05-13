<template>
  <div class="como-funciona-page">
    <section class="como-hero">
      <span class="eyebrow">Guia de uso</span>
      <h1>Como funciona o IFF Pesquisas</h1>
      <p>
        Entenda os fluxos principais para divulgar pesquisas, solicitar colaboração
        entre cursos e acompanhar interações acadêmicas na plataforma.
      </p>
    </section>

    <section class="quick-nav" aria-label="Atalhos do guia">
      <a href="#publicar-pesquisa">Publicar pesquisa</a>
      <a href="#solicitar-colaboracao">Solicitar colaboração</a>
      <a href="#demonstrar-interesse">Demonstrar interesse</a>
      <a href="#gerenciar-publicacoes">Gerenciar publicações</a>
      <a href="#arquivos-aceitos">Arquivos aceitos</a>
    </section>

    <section class="guide-section" id="publicar-pesquisa">
      <div class="section-heading">
        <span class="step-number">1</span>
        <div>
          <h2>Publicar uma pesquisa</h2>
          <p>Use este fluxo para divulgar TCCs, projetos de extensão e pesquisas acadêmicas.</p>
        </div>
      </div>
      <ol class="steps-list">
        <li>Acesse sua conta institucional.</li>
        <li>Escolha <strong>Publicar pesquisa</strong> no menu superior.</li>
        <li>Informe título, resumo, área de conhecimento e orientador.</li>
        <li>Adicione palavras-chave e, se desejar, PDF e imagem de capa.</li>
        <li>Revise as informações e confirme a publicação.</li>
      </ol>
    </section>

    <section class="guide-section" id="solicitar-colaboracao">
      <div class="section-heading">
        <span class="step-number">2</span>
        <div>
          <h2>Solicitar colaboração entre cursos</h2>
          <p>Use este fluxo quando seu projeto precisa de apoio de estudantes de outros cursos.</p>
        </div>
      </div>
      <ol class="steps-list">
        <li>Acesse <strong>Colaborações</strong> e selecione <strong>Nova solicitação</strong>.</li>
        <li>Descreva o projeto e o tipo de apoio necessário.</li>
        <li>Selecione os cursos desejados para colaboração.</li>
        <li>Informe área de conhecimento, urgência, orientador e competências necessárias.</li>
        <li>Publique a solicitação para que outros alunos possam demonstrar interesse.</li>
      </ol>
    </section>

    <section class="guide-section" id="demonstrar-interesse">
      <div class="section-heading">
        <span class="step-number">3</span>
        <div>
          <h2>Demonstrar interesse em colaborar</h2>
          <p>Alunos autenticados podem indicar interesse em solicitações abertas.</p>
        </div>
      </div>
      <ol class="steps-list">
        <li>Abra a página de detalhes de uma solicitação de colaboração.</li>
        <li>Leia a descrição, cursos solicitados e competências necessárias.</li>
        <li>Selecione <strong>Demonstrar interesse</strong>.</li>
        <li>O autor verá seu nome na lista de interessados e poderá acompanhar a interação.</li>
        <li>Se mudar de ideia, remova o interesse na mesma tela.</li>
      </ol>
    </section>

    <section class="guide-section" id="gerenciar-publicacoes">
      <div class="section-heading">
        <span class="step-number">4</span>
        <div>
          <h2>Gerenciar publicações</h2>
          <p>A área pessoal concentra as pesquisas criadas pelo usuário autenticado.</p>
        </div>
      </div>
      <ol class="steps-list">
        <li>Acesse <strong>Minhas publicações</strong>.</li>
        <li>Abra uma pesquisa para revisar como ela aparece no feed.</li>
        <li>Use <strong>Editar</strong> para corrigir conteúdo.</li>
        <li>Use <strong>Despublicar</strong> para remover temporariamente do feed público.</li>
        <li>Use <strong>Excluir</strong> apenas quando tiver certeza, pois a ação exige confirmação.</li>
      </ol>
    </section>

    <section class="guide-section" id="arquivos-aceitos">
      <div class="section-heading">
        <span class="step-number">5</span>
        <div>
          <h2>Arquivos aceitos</h2>
          <p>Os arquivos ajudam a complementar a publicação, mas devem seguir os formatos esperados.</p>
        </div>
      </div>
      <ul class="file-list">
        <li><strong>PDF da pesquisa:</strong> arquivo em formato PDF, com tamanho máximo indicado no formulário.</li>
        <li><strong>Imagem de capa da pesquisa:</strong> imagem JPG ou PNG, preferencialmente em formato horizontal.</li>
        <li><strong>Imagem da solicitação de colaboração:</strong> JPG, PNG ou WebP, até 5 MB.</li>
      </ul>
    </section>

    <section class="help-callout">
      <h2>Boas práticas</h2>
      <p>
        Prefira títulos objetivos, descreva o problema acadêmico com clareza,
        indique o orientador e revise as informações antes de publicar. Isso
        facilita a busca, reduz erros e ajuda alunos de diferentes cursos a
        entenderem como participar.
      </p>
      <div class="help-actions">
        <router-link to="/feed" class="btn btn-outline">Explorar pesquisas</router-link>
        <router-link to="/colaboracoes" class="btn btn-primary">Ver colaborações</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.como-funciona-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 920px;
  margin: 0 auto;
  text-align: left;
}

.como-hero {
  padding: 2rem 0 0.5rem;
}

.eyebrow {
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.como-hero h1 {
  margin: 0.4rem 0 0.7rem;
  font-size: clamp(2rem, 4vw, 3rem);
}

.como-hero p {
  max-width: 680px;
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.quick-nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.8rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
}

.quick-nav a {
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
}

.quick-nav a:hover,
.quick-nav a:focus {
  background: var(--primary-light);
  color: var(--primary);
}

.guide-section {
  padding: 1.4rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
}

.section-heading {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  font-weight: 800;
  flex-shrink: 0;
}

.section-heading h2 {
  margin: 0 0 0.2rem;
  font-size: 1.2rem;
}

.section-heading p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.steps-list,
.file-list {
  margin: 0;
  padding-left: 1.35rem;
  color: var(--text);
  line-height: 1.8;
}

.help-callout {
  padding: 1.5rem;
  border-radius: var(--radius-md);
  background:
    linear-gradient(135deg, var(--primary-light), var(--surface-2)),
    var(--surface);
  border: 1px solid var(--border);
}

.help-callout h2 {
  margin: 0 0 0.5rem;
}

.help-callout p {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.help-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .guide-section,
  .help-callout {
    padding: 1.1rem;
  }

  .section-heading {
    gap: 0.75rem;
  }
}
</style>
