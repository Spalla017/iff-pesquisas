# Decisões Técnicas — Front-end IFF Pesquisas

Este documento registra as decisões arquiteturais e tecnológicas tomadas durante o desenvolvimento do front-end, servindo como referência para o texto do TCC e para futuros mantenedores.

---

## 1. Abordagem Mock-First

**Decisão:** O front-end opera com dados locais simulados (`mockPesquisas.ts`) ao invés de consumir uma API real.

**Justificativa:**
- O recorte do TCC é focado exclusivamente no front-end, permitindo desenvolvimento e validação independentes do back-end.
- A camada de integração está **100% preparada** para API real:
  - `services/api.ts` — instância Axios com `baseURL` configurável via variáveis de ambiente (`VITE_API_BASE_URL`).
  - Interceptors de request (injeção automática de token Bearer) e response (redirecionamento em 401).
  - Variável `VITE_USE_API_AUTH` permite alternar entre login mock e login real sem modificar código.
- Toda a lógica de stores (`buscarPesquisas`, `criarPesquisa`, `atualizarPesquisa`, etc.) simula delays de rede para testar estados de carregamento reais.

**Transição para API real:** Substituir os `setTimeout` nas stores por chamadas `api.get()` / `api.post()`, mantendo a mesma interface de retorno.

---

## 2. Zod sem VeeValidate

**Decisão:** Utilizar apenas Zod para validação de schemas, sem adotar VeeValidate para binding de formulários.

**Justificativa:**
- O plano executivo previa VeeValidate + Zod na stack. Após avaliação, concluiu-se que:
  - Os formulários do sistema são simples (login, criação de post, recuperação de senha) e não se beneficiam da complexidade adicional do VeeValidate.
  - Zod sozinho fornece schemas tipados e reutilizáveis, com mensagens de erro em português.
  - A validação via `safeParse()` é integrada diretamente nas stores e components, reduzindo boilerplate.
- Schemas centralizados em `src/schemas/index.ts` garantem consistência e reutilização.

**Benefício:** Menos dependências, menor bundle size, mesma cobertura funcional.

---

## 3. CSS Puro com Design Tokens

**Decisão:** Utilizar CSS vanilla com custom properties (design tokens) ao invés de frameworks como TailwindCSS ou Vuetify.

**Justificativa:**
- Controle total sobre a estética e o design system, sem overhead de classes utilitárias.
- ~40 CSS custom properties definidas em `globals.css` cobrem cores, sombras, espaçamentos, raios, tipografia e transições.
- Suporte completo a dark mode via `html[data-theme='dark']` sobrescrevendo todas as variáveis.
- Componentes utilizam `scoped styles` do Vue, evitando conflitos de CSS.

**Resultado:** Interface com identidade visual própria, sem dependência de frameworks externos.

---

## 4. Composition API + `<script setup>`

**Decisão:** Adotar exclusivamente a Composition API do Vue 3 com a sintaxe `<script setup>`.

**Justificativa:**
- Sintaxe mais concisa e moderna, recomendada pela documentação oficial do Vue 3.
- Melhor inferência de tipos com TypeScript.
- Composables (`useAuth.ts`) permitem reutilização de lógica entre componentes.
- Alinhamento com as melhores práticas atuais da comunidade Vue.

---

## 5. Sistema de Repositórios

**Decisão:** O módulo de "gerenciamento de repositórios" definido no projeto original do Luiz Cláudio não foi implementado no front-end.

**Justificativa:**
- O escopo do TCC é o front-end da plataforma de posts/pesquisas.
- O sistema de repositórios (pastas de PDFs, controle de visibilidade por arquivo) é funcionalidade de back-end que requer gerenciamento de arquivos no servidor.
- No front-end, o upload de PDF e imagem já está implementado no formulário de criação de post.

**Trabalho futuro:** Implementar interface de gerenciamento de repositórios quando o back-end disponibilizar os endpoints correspondentes.

---

## 6. Testes com Vitest

**Decisão:** Utilizar Vitest como framework de testes unitários, com happy-dom como ambiente de DOM.

**Justificativa:**
- Integração nativa com Vite (mesma resolução de aliases, transforms e plugins).
- API compatível com Jest, facilitando a curva de aprendizado.
- happy-dom é mais leve e rápido que jsdom para testes de componentes Vue.
- @pinia/testing e @vue/test-utils fornecem utilitários especializados para Vue 3.

**Cobertura atual:** 57 testes previstos em 7 arquivos cobrindo stores (auth, pesquisa, toast), componentes/paginas (PesquisaCard, SearchFilters, RecoverPasswordPage) e schemas Zod.

---

## 7. Politica de Visibilidade de Rascunhos

**Decisao:** Rascunhos nao sao conteudo publico. Eles ficam fora do feed e tambem nao podem ser acessados por visitantes via URL direta em `/pesquisa/:id`.

**Justificativa:**
- O status `rascunho` representa uma publicacao removida do acervo publico.
- A mesma regra precisa valer para listagem e detalhe, evitando que um link compartilhado mantenha visibilidade indevida.
- No modo mock-first ainda nao existe proprietario real por pesquisa. Por isso, qualquer usuario autenticado pode visualizar rascunhos; a validacao por dono deve ser aplicada quando a API real estiver integrada.

**Implementacao:**
- `buscarPorId(id, { incluirRascunhos })` centraliza a regra na store.
- A pagina de detalhe habilita `incluirRascunhos` apenas quando `authStore.isAutenticado` e verdadeiro.

---

## 8. Playwright para Testes E2E

**Decisao:** Adotar Playwright como ferramenta E2E, complementando os testes unitarios com Vitest.

**Justificativa:**
- O Plano Executivo previa Cypress/Playwright para fluxos principais.
- Playwright fornece servidor local integrado, gravacao de video, traces e execucao cross-browser.
- A suite E2E valida comportamento real de roteamento, autenticacao, CRUD mock, atalhos e tema.

**Implementacao planejada no repositorio:**
- `playwright.config.ts` usa Vite local em `127.0.0.1:5173`.
- Scripts: `e2e`, `e2e:headed`, `e2e:report`.
- Specs em `frontend/e2e/` cobrem fluxos publicos, autenticados e gravacao do video `Docs/evidencias/13_demo_fluxo.webm`.

**Observacao operacional:** A instalacao do pacote `@playwright/test` e dos browsers depende de acesso ao registry e permissao de execucao fora do sandbox.
