# Verificacao do Plano de Finalizacao do Front-end

**Data:** 06/05/2026  
**Fonte:** planejamento de finalizacao do front-end  
**Escopo:** bloqueio publico de rascunhos, Zod em runtime, Playwright E2E, evidencias e documentacao.

---

## Resumo Executivo

| Area | Status | Evidencia |
|---|---|---|
| Visibilidade de rascunhos | Implementado | `buscarPorId(id, { incluirRascunhos })` e detalhe publico condicionado por autenticacao |
| Zod em formularios reais | Implementado | `CreatePostPage.vue` e `RecoverPasswordPage.vue` usam `safeParse()` |
| Testes unitarios adicionais | Implementado | Casos de rascunho, resumo > 500 e recuperacao por schema |
| Playwright E2E | Configurado | `playwright.config.ts`, scripts `e2e*` e specs em `frontend/e2e/` |
| Video de evidencia | Automatizado, pendente de execucao | Spec `demo-video.spec.ts` grava `Docs/evidencias/13_demo_fluxo.webm` |

---

## Correcoes Aplicadas

### 1. Rascunhos nao ficam publicos por URL direta

- `frontend/src/stores/pesquisa.store.ts`
  - `buscarPorId` agora aceita `{ incluirRascunhos?: boolean }`.
  - Por padrao, retorna apenas pesquisas `publica`.
  - Com a opcao ativa, retorna tambem `rascunho`.
- `frontend/src/pages/PesquisaDetailPage.vue`
  - A rota publica consulta `authStore.isAutenticado`.
  - Visitantes recebem o estado "Pesquisa nao encontrada" para rascunhos.
  - Usuarios autenticados conseguem visualizar rascunhos a partir de "Meus Posts".

### 2. Zod aplicado em runtime

- `frontend/src/pages/CreatePostPage.vue`
  - `handleSubmit()` valida os dados com `createPostSchema.safeParse()` antes de enviar para a store.
  - Payload enviado usa `dadosValidados.data`.
- `frontend/src/pages/RecoverPasswordPage.vue`
  - A validacao manual com `endsWith('@iff.edu.br')` foi substituida por `recoverPasswordSchema.safeParse()`.
- `frontend/src/schemas/index.ts`
  - `createPostSchema.resumo` foi alinhado para no maximo 500 caracteres.

### 3. Testes unitarios ampliados

Novos casos previstos:

- `buscarPorId` nao retorna rascunho por padrao.
- `buscarPorId(..., { incluirRascunhos: true })` retorna rascunho.
- `createPostSchema` rejeita resumo acima de 500 caracteres.
- `RecoverPasswordPage` exibe mensagem do schema para e-mail nao institucional.

### 4. Playwright E2E

Arquivos criados:

- `frontend/playwright.config.ts`
- `frontend/e2e/helpers.ts`
- `frontend/e2e/public.spec.ts`
- `frontend/e2e/auth-flows.spec.ts`
- `frontend/e2e/demo-video.spec.ts`

Scripts adicionados:

- `npm run e2e`
- `npm run e2e:headed`
- `npm run e2e:report`

Fluxos cobertos:

- Home, Feed e detalhe publico.
- Login invalido.
- Login valido com redirect para rota protegida original.
- Criacao de post e aparicao no feed.
- Edicao de post.
- Despublicacao e remocao do feed.
- Bloqueio publico do detalhe de rascunho.
- Acesso autenticado ao rascunho.
- Recuperacao de senha com e-mail institucional.
- Atalho `Ctrl+K`.
- Dark mode.

### 5. Video de demonstracao

O teste `frontend/e2e/demo-video.spec.ts` cria o video automaticamente em:

`Docs/evidencias/13_demo_fluxo.webm`

Nesta sessao, o arquivo ainda nao foi gerado porque o ambiente bloqueou a instalacao do `@playwright/test` e a execucao fora do sandbox foi recusada por limite de aprovacao.

---

## Verificacao Nesta Sessao

| Comando | Status | Observacao |
|---|---|---|
| `npm install @playwright/test --save-dev` | Bloqueado | Registry indisponivel no sandbox: `ENOTCACHED` |
| Instalacao com aprovacao | Bloqueada | Aprovacao automatica recusada por limite da sessao |
| `npm run test:run` | Bloqueado | Vite/Vitest falhou com `spawn EPERM` no OneDrive |
| `npm run build` | Parcial | `vue-tsc -b` concluiu; `vite build` falhou com `spawn EPERM` no sandbox |
| `npm run e2e` | Nao executado | Depende da instalacao do Playwright |
| `git diff --check` | Aprovado | Sem erros de whitespace |

---

## Proximo Comando Local Recomendado

Quando houver acesso ao registry/aprovacao:

```bash
cd frontend
npm install
npx playwright install chromium
npm run test:run
npm run build
npm run e2e
git diff --check
```

---

## Conclusao

As correcoes de codigo e a automacao E2E foram implementadas. O fechamento operacional depende apenas da instalacao do Playwright e da execucao dos comandos de verificacao em um ambiente com permissao para baixar dependencias e executar Vite/Vitest fora das restricoes do sandbox atual.
