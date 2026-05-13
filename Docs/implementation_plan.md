# Plano de Testes & Correções — Módulo de Colaboração

## Contexto

Após a implementação completa do módulo de Colaboração entre Cursos, realizamos:
- ✅ Testes unitários existentes: **61/61 passando** (nenhuma regressão)
- ✅ Sessão de QA visual no browser com ~30 ações testadas

![Sessão de QA visual completa](C:/Users/vsilva/.gemini/antigravity/brain/90ff03e2-310d-4ad6-a69d-b75e18eafa5a/artifacts/bug_hunting_session.webp)

---

## 🐛 Bugs Confirmados (4)

### Bug 1: Erros de validação não desaparecem reativamente
**Severidade:** 🟡 Média  
**Onde:** `CriarSolicitacaoPage.vue`  
**Problema:** Ao submeter o formulário vazio, os erros Zod aparecem corretamente. Porém, ao preencher os campos, os erros **não desaparecem** até clicar "Publicar" novamente.  
**Causa:** Os erros são armazenados em um `reactive({})` estático que só é limpo no `handleSubmit`.  
**Correção:** Adicionar `watch` nos campos do formulário para limpar erros individuais ao digitar.

```diff
+ // Limpar erro individual quando o campo é preenchido
+ watch(() => form.titulo, () => { if (erros.titulo) delete erros.titulo; });
+ watch(() => form.descricao, () => { if (erros.descricao) delete erros.descricao; });
+ watch(() => form.cursosDesejados, () => { if (erros.cursosDesejados) delete erros.cursosDesejados; }, { deep: true });
+ watch(() => form.area, () => { if (erros.area) delete erros.area; });
+ watch(() => form.urgencia, () => { if (erros.urgencia) delete erros.urgencia; });
+ watch(() => form.orientador, () => { if (erros.orientador) delete erros.orientador; });
```

---

### Bug 2: Busca textual aplica filtros com debounce faltante
**Severidade:** 🟢 Baixa  
**Onde:** `ColaboracaoFilters.vue`  
**Problema:** Cada tecla digitada na busca dispara `aplicarFiltros()` imediatamente (via `@input`), causando múltiplas re-renders desnecessárias. Deveria ter um debounce.  
**Correção:** Adicionar debounce de 300ms na busca textual.

```diff
+ import { watch } from 'vue';
+
+ // Debounce na busca por texto
+ let debounceTimer: ReturnType<typeof setTimeout>;
+ watch(termoLocal, () => {
+   clearTimeout(debounceTimer);
+   debounceTimer = setTimeout(() => aplicarFiltros(), 300);
+ });
- @input="aplicarFiltros"
```

---

### Bug 3: CSS usando variáveis `--accent` e `--bg` não definidas
**Severidade:** 🟡 Média  
**Onde:** `ColaboracaoCard.vue`, `InteresseButton.vue`, `ColaboracoesPage.vue`  
**Problema:** Os componentes de colaboração usam variáveis CSS como `--accent`, `--bg`, `--text-h`, `--border`, `--shadow` que **não estão definidas** no design system existente (`globals.css`). Funciona porque o dark theme usa valores fallback, mas no light theme certas cores podem não renderizar corretamente.  
**Correção:** Mapear as variáveis usadas para as equivalentes do design system existente, ou adicionar aliases em `globals.css`.

```diff
+ /* Aliases para compatibilidade — globals.css */
+ :root {
+   --accent: var(--primary);
+   --accent-bg: var(--primary-light);
+   --accent-border: rgba(30, 58, 138, 0.2);
+   --bg: var(--surface);
+   --text-h: var(--text);
+   --code-bg: var(--surface-2);
+   --shadow: var(--shadow-md);
+   --heading: var(--font-display);
+   --sans: var(--font-body, inherit);
+ }
```

---

### Bug 4: `ColaboracaoFilters.vue` importa `AREAS_DISPONIVEIS` que pode ser undefined
**Severidade:** 🟢 Baixa  
**Onde:** `ColaboracaoFilters.vue` linha ~125  
**Problema:** O import `import { AREAS_DISPONIVEIS } from '@/data/mockPesquisas'` funciona, mas cria um acoplamento entre os módulos de pesquisas e colaborações. Se `mockPesquisas.ts` mudar, os filtros de colaboração podem quebrar.  
**Correção:** Mover ou duplicar `AREAS_DISPONIVEIS` para `mockColaboracoes.ts`, ou criar um arquivo compartilhado `constants.ts`.

---

## 💡 Melhorias de UX (6)

### Melhoria 1: Card inteiro clicável
**Onde:** `ColaboracaoCard.vue`  
**Problema:** Apenas o link "Ver detalhes →" é clicável. O usuário espera clicar em qualquer parte do card.  
**Solução:** Envolver o card com `<router-link>` ou adicionar cursor pointer com `@click` no artigo.

---

### Melhoria 2: Contagem de caracteres com cor dinâmica
**Onde:** `CriarSolicitacaoPage.vue`  
**Problema:** O contador de caracteres (ex: "0/150") é cinza estático. Não dá feedback visual quando se aproxima do limite.  
**Solução:** Mudar a cor para amarelo quando > 80% e vermelho quando > 95%.

---

### Melhoria 3: Skeleton loading nos cards
**Onde:** `ColaboracoesPage.vue`  
**Problema:** O loading mostra apenas um spinner centralizado. Cards skeleton seriam mais profissionais.  
**Solução:** Criar um `ColaboracaoCardSkeleton.vue` com placeholders animados.

---

### Melhoria 4: Confirmação ao sair do formulário com dados preenchidos
**Onde:** `CriarSolicitacaoPage.vue`  
**Problema:** Se o usuário preencheu dados e navega para outra página, perde tudo sem aviso.  
**Solução:** Adicionar `beforeRouteLeave` guard com confirmação.

---

### Melhoria 5: Animação de contagem de interessados
**Onde:** `ColaboracaoDetailPage.vue`  
**Problema:** Ao clicar "Tenho interesse", a contagem muda instantaneamente sem feedback visual.  
**Solução:** Adicionar animação de incremento/decremento no número.

---

### Melhoria 6: Toast notification com link "Ver detalhes" após criar solicitação
**Onde:** `CriarSolicitacaoPage.vue`  
**Problema:** Após criar, redireciona para o feed. O toast poderia incluir um link para ver a solicitação criada.  
**Solução:** Usar o ID retornado da criação para incluir link no toast.

---

## 🧪 Novos Testes Unitários

### [NEW] `__tests__/stores/colaboracao.store.spec.ts`

Seguindo o padrão do `pesquisa.store.spec.ts`, cobrindo:

| Grupo | Testes |
|---|---|
| **Inicialização** | Carrega mock data ao inicializar |
| **Filtros** | Filtra por `cursoDesejado`, `cursoOrigem`, `area`, `status`, `urgencia`, `termo` |
| **Filtros combinados** | Retorna interseção de múltiplos filtros |
| **Reset filtros** | `resetarFiltros()` limpa filtros e reseta página |
| **Paginação** | Respeita limite de 6, `irParaPagina()` funciona |
| **Criar** | `criarColaboracao()` adiciona no início da lista |
| **Criar** | Usa o usuário autenticado como autor e curso de origem |
| **Persistência** | Persiste colaborações no localStorage |
| **Demonstrar interesse** | Adiciona interesse do usuário logado |
| **Demonstrar interesse** | Não permite autor no próprio projeto |
| **Demonstrar interesse** | Não permite duplicata |
| **Remover interesse** | Remove interesse existente |
| **Atualizar status** | Muda status de aberta para em_andamento |
| **Deletar** | Remove colaboração da lista |
| **buscarPorId** | Encontra por ID |
| **buscarPorId** | Define erro para ID inexistente |
| **Helpers** | `usuarioJaInteressado()` retorna boolean correto |
| **Helpers** | `usuarioEhAutor()` retorna boolean correto |

**Total estimado: ~20 testes**

---

### [NEW] `__tests__/schemas/colaboracao.schema.spec.ts`

| Teste | Descrição |
|---|---|
| Aceita dados válidos | Payload completo com todos os campos preenchidos |
| Rejeita título vazio | `titulo: ""` → erro |
| Rejeita título > 150 chars | Título com 151 caracteres |
| Rejeita descrição curta | `descricao` com menos de 20 caracteres |
| Rejeita cursos vazio | `cursosDesejados: []` → erro |
| Rejeita urgência inválida | `urgencia: "urgentissima"` → erro |
| Aceita competências default | `competenciasNecessarias` não enviado → `[]` |
| Rejeita > 8 competências | Array com 9 itens |

**Total estimado: ~8 testes**

---

### [NEW] `__tests__/components/ColaboracaoCard.spec.ts`

| Teste | Descrição |
|---|---|
| Renderiza título | Exibe o título da colaboração |
| Renderiza badges | Mostra urgência e status |
| Renderiza cursos desejados | Exibe badges de cursos |
| Limita competências | Mostra no máximo 3 + "+N" |
| Trunca descrição | Descrições longas terminam com "..." |
| Link correto | "Ver detalhes" aponta para `/colaboracoes/:id` |
| Contagem de interessados | Mostra número correto |

**Total estimado: ~7 testes**

---

## Proposed Changes

### Fase 1 — Correções de Bugs (Prioridade Alta)

#### [MODIFY] [CriarSolicitacaoPage.vue](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/pages/CriarSolicitacaoPage.vue)
- Adicionar `watch` para limpar erros reativamente (Bug 1)

#### [MODIFY] [ColaboracaoFilters.vue](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/components/common/ColaboracaoFilters.vue)
- Adicionar debounce na busca textual (Bug 2)
- Remover import de `AREAS_DISPONIVEIS` do mockPesquisas (Bug 4)

#### [MODIFY] [globals.css](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/styles/globals.css)
- Adicionar aliases CSS `--accent`, `--bg`, etc. (Bug 3)

#### [MODIFY] [mockColaboracoes.ts](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/data/mockColaboracoes.ts)
- Exportar `AREAS_DISPONIVEIS` localmente (Bug 4)

---

### Fase 2 — Novos Testes Unitários

#### [NEW] [colaboracao.store.spec.ts](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/__tests__/stores/colaboracao.store.spec.ts)
#### [NEW] [colaboracao.schema.spec.ts](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/__tests__/schemas/colaboracao.schema.spec.ts)
#### [NEW] [ColaboracaoCard.spec.ts](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/__tests__/components/ColaboracaoCard.spec.ts)

---

### Fase 3 — Melhorias de UX (Prioridade Baixa)

#### [MODIFY] [ColaboracaoCard.vue](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/components/common/ColaboracaoCard.vue)
- Tornar card inteiro clicável (Melhoria 1)

#### [MODIFY] [CriarSolicitacaoPage.vue](file:///c:/Users/vsilva/OneDrive%20-%20UNIMED%20N%20FLUMINENSE/Documentos/GitHub/iff-pesquisas/frontend/src/pages/CriarSolicitacaoPage.vue)
- Contador de caracteres com cor dinâmica (Melhoria 2)
- Guard `beforeRouteLeave` (Melhoria 4)

---

## Verification Plan

### Testes automatizados
```bash
# Rodar todos os testes (existentes + novos)
npm run test:run

# Meta: 61 existentes + ~35 novos = ~96 testes passando
```

### Verificação visual
- Preencher formulário parcialmente → verificar que erros somem ao corrigir
- Digitar na busca rapidamente → verificar que debounce evita flickering
- Verificar que o light theme e dark theme renderizam cores corretamente
- Clicar no card inteiro → verificar navegação para detalhe

### Regressão
- Confirmar que os 61 testes existentes continuam passando
- Confirmar que nenhuma página existente foi afetada
