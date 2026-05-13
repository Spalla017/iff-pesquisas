# Design System de Cores — IFF Pesquisas

## 1. Objetivo

Padronizar a identidade visual do **IFF Pesquisas** com uma paleta institucional baseada no modelo de composição visual **60-30-10**. A paleta transmite confiança, seriedade acadêmica, institucionalidade, colaboração, clareza, acessibilidade e modernidade sem perder sobriedade.

Todas as cores são controladas por **tokens CSS** (Custom Properties) definidos em `frontend/src/styles/globals.css`. Nenhum componente deve usar cores hexadecimais ou rgba diretamente — use sempre `var(--token)`.

---

## 2. Modelo 60-30-10

| Percentual | Função | Tokens Principais | Onde usar |
|---|---|---|---|
| **60%** | Base neutra | `--bg`, `--bg-strong`, `--surface`, `--surface-2`, `--surface-hover`, `--text`, `--text-secondary`, `--muted` | Fundo geral, cards, formulários, áreas de leitura, containers, modais, tabelas, textos |
| **30%** | Identidade institucional (verde) | `--primary`, `--primary-2`, `--primary-light`, `--ring` | Botões primários, links, filtros ativos, navegação, foco, ícones institucionais |
| **10%** | Destaque acadêmico (dourado) | `--accent`, `--accent-2`, `--accent-light` | Badges, métricas, selos, keywords, destaques pontuais |

### Princípios

- A **base neutra (60%)** domina toda a interface — fundos, superfícies, cards, inputs, textos.
- O **verde institucional (30%)** identifica ações principais — botões, links, filtros ativos, navegação.
- O **dourado acadêmico (10%)** é usado com moderação — badges de destaque, selos, keywords, métricas.
- **Cores semânticas** (success, danger, warning) são usadas exclusivamente para estados do sistema.
- O dourado (`--accent`) **não deve ser confundido** com `--warning` (estado de alerta do sistema).

---

## 3. Paleta Oficial

### 3.1 Cores 60% — Base Neutra

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#f6f8fb` | Fundo geral da aplicação |
| `--bg-strong` | `#e8edf5` | Áreas neutras e estados desabilitados |
| `--surface` | `#ffffff` | Cards, inputs, modais e listas |
| `--surface-2` | `#f9fbfd` | Cards destacados e áreas sutis |
| `--surface-hover` | `#f1f5f9` | Estado hover em superfícies |
| `--text` | `#0b1d3a` | Títulos e conteúdo principal |
| `--text-secondary` | `#374151` | Labels e navegação |
| `--muted` | `#5a6477` | Descrições, hints e metadados |

### 3.2 Cores 30% — Identidade Institucional

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#124734` | Ações principais, botões, navegação ativa |
| `--primary-2` | `#0f766e` | Hover, gradientes e variações |
| `--primary-light` | `rgba(18, 71, 52, 0.08)` | Fundo sutil para filtros, tags e pills |
| `--ring` | `rgba(15, 118, 110, 0.26)` | Anel de foco acessível |

**Regras:**
- `--primary` é a cor principal de ação
- `--primary-2` é usada em gradientes e variações visuais
- Botões primários usam: `linear-gradient(135deg, var(--primary), var(--primary-2))`

### 3.3 Cores 10% — Destaque Acadêmico

| Token | Valor | Uso |
|---|---|---|
| `--accent` | `#b7791f` | Dourado acadêmico — destaques e métricas |
| `--accent-2` | `#8a3d18` | Texto de badges e selos sobre fundo claro |
| `--accent-light` | `rgba(183, 121, 31, 0.12)` | Fundo sutil para badges e keywords |

**Regras:**
- ⚠️ **Não usar como cor de botões de ação crítica**
- Usar para: badges, keywords, selos, métricas, indicadores de "evidência", "novo", "destaque"
- Não confundir com `--warning` (alerta do sistema)

### 3.4 Cores Semânticas

| Token | Valor | Uso |
|---|---|---|
| `--success` | `#059669` | Publicação criada, interesse registrado, status positivo |
| `--success-light` | `rgba(5, 150, 105, 0.10)` | Fundo de badges/alertas de sucesso |
| `--danger` | `#dc2626` | Exclusão, erro, falha, ação destrutiva |
| `--danger-light` | `rgba(220, 38, 38, 0.08)` | Fundo de badges/alertas de erro |
| `--warning` | `#d97706` | Rascunho, atenção, pendência |
| `--warning-light` | `rgba(217, 119, 6, 0.08)` | Fundo de badges/alertas de aviso |
| `--border` | `rgba(15, 23, 42, 0.10)` | Bordas discretas |
| `--border-strong` | `rgba(15, 23, 42, 0.18)` | Bordas com mais contraste |

---

## 4. Tokens CSS

Os tokens ficam em `:root` em `frontend/src/styles/globals.css` e são espelhados em `html[data-theme='dark']`.

### Tokens Derivados

| Token | Uso |
|---|---|
| `--on-primary` | Texto sobre fundo primary (#ffffff) |
| `--on-danger` | Texto sobre fundo danger (#ffffff) |
| `--on-accent` | Texto sobre fundo accent |
| `--on-success` | Texto sobre fundo success |
| `--on-warning` | Texto sobre fundo warning |
| `--surface-glass` | Superfícies com glassmorphism |
| `--surface-glass-strong` | Glassmorphism mais opaco |
| `--overlay` | Backdrop de modais |
| `--overlay-strong` | Backdrop mais escuro |
| `--placeholder` | Cor de placeholder em inputs |
| `--primary-border` | Bordas com cor primary |
| `--primary-shadow` | Sombras primary (botões) |
| `--primary-shadow-strong` | Sombras primary intensas (hover) |
| `--accent-border` | Bordas com cor accent |
| `--accent-shadow` | Sombras accent |
| `--success-border` | Bordas com cor success |
| `--danger-border` | Bordas com cor danger |
| `--warning-border` | Bordas com cor warning |
| `--footer-bg` | Fundo do footer |
| `--footer-text` | Texto do footer |
| `--footer-muted` | Texto secundário do footer |

### Tokens de Layout

| Token | Valor | Uso |
|---|---|---|
| `--shadow-xs` | `0 1px 2px` | Sombra mínima |
| `--shadow-sm` | `0 4px 12px` | Cards e elementos sutis |
| `--shadow-md` | `0 12px 32px` | Cards em hover e modais |
| `--shadow-lg` | `0 24px 56px` | Toasts e dropdowns |
| `--radius-sm` | `6px` | Inputs e elementos menores |
| `--radius-md` | `8px` | Cards e botões |
| `--radius-lg` | `8px` | Containers e painéis |
| `--radius-pill` | `999px` | Badges, pills e chips |
| `--font-body` | Plus Jakarta Sans | Corpo de texto |
| `--font-display` | Space Grotesk | Títulos e métricas |

---

## 5. Regras de Uso

### 5.1 Nunca usar cores fixas nos componentes

```css
/* ❌ PROIBIDO */
color: #aa3bff;
background: #3b82f6;
border-color: red;

/* ✅ CORRETO */
color: var(--primary);
background: var(--surface);
border-color: var(--border);
```

Exceções apenas para transparências muito específicas ou elementos gráficos isolados (justificados).

### 5.2 Botões

| Tipo | Classe CSS | Background | Uso |
|---|---|---|---|
| Primário | `.btn-primary` | `linear-gradient(135deg, var(--primary), var(--primary-2))` | Ação principal |
| Outline | `.btn-outline` | `var(--surface)` com `--border-strong` | Ação secundária |
| Sucesso | `.btn-success` | `var(--success)` | Confirmação positiva |
| Perigo | `.btn-danger` | `var(--danger)` | Ação destrutiva |
| Ghost | `.btn-ghost` | Transparente | Ação terciária |

> ⚠️ **Dourado (`--accent`) nunca deve ser usado como cor de botões de ação principal.**

### 5.3 Cards

```css
/* Card padrão */
background: var(--surface);
border: 1px solid var(--border);
box-shadow: var(--shadow-sm);

/* Card acadêmico (destaque sutil) */
background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
```

### 5.4 Formulários

```css
/* Estado normal */
background: var(--surface);
color: var(--text);
border: 1.5px solid var(--border);

/* Estado de foco */
border-color: var(--primary);
box-shadow: 0 0 0 3px var(--ring);

/* Estado de erro */
border-color: var(--danger);
color: var(--danger);
background: var(--danger-light);
```

### 5.5 Badges, Pills e Tags

| Classe | Background | Color | Uso |
|---|---|---|---|
| `.badge` | `--primary-light` | `--primary` | Status institucional |
| `.badge-success` | `--success-light` | `--success` | Sucesso / publicada |
| `.badge-warning` | `--warning-light` | `--warning` | Rascunho / pendência |
| `.badge-danger` | `--danger-light` | `--danger` | Erro / removida |
| `.badge-featured` | `--accent-light` | `--accent-2` | Destaque acadêmico |
| `.badge-accent` | `--accent-light` | `--accent` | Acento suave |
| `.pill` | `--bg-strong` | `--muted` | Pill neutra |
| `.pill-active` | `--primary` | `--on-primary` | Filtro ativo |
| `.ribbon` | `--accent-light` | `--accent-2` | Decorativo |
| `.keyword` | `--accent-light` | `--accent-2` | Palavra-chave |

---

## 6. Modo Claro

O modo claro é o padrão, definido em `:root`. Utiliza:
- Fundos claros frios (`#f6f8fb`, `#ffffff`)
- Textos escuros profundos (`#0b1d3a`)
- Verde institucional denso (`#124734`)
- Dourado terroso como acento (`#b7791f`)

---

## 7. Modo Escuro

Ativado via `html[data-theme='dark']`. Todas as cores são ajustadas para manter legibilidade e hierarquia visual.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f6f8fb` | `#101827` |
| `--bg-strong` | `#e8edf5` | `#1f2a3d` |
| `--surface` | `#ffffff` | `#121c2d` |
| `--surface-2` | `#f9fbfd` | `#172236` |
| `--text` | `#0b1d3a` | `#eef5f1` |
| `--text-secondary` | `#374151` | `#d5dedb` |
| `--muted` | `#5a6477` | `#a9b6c3` |
| `--primary` | `#124734` | `#4ade80` |
| `--primary-2` | `#0f766e` | `#2dd4bf` |
| `--accent` | `#b7791f` | `#f0b84a` |
| `--accent-2` | `#8a3d18` | `#f6c35f` |
| `--success` | `#059669` | `#34d399` |
| `--danger` | `#dc2626` | `#fb7185` |
| `--warning` | `#d97706` | `#fbbf24` |
| `--border` | `rgba(15,23,42,0.10)` | `rgba(255,255,255,0.10)` |

O toggle de tema está em `Header.vue` e persiste a escolha no `localStorage`.

---

## 8. Acessibilidade e Contraste

### Verificações implementadas

- ✅ **Texto sobre fundo:** `--text` (#0b1d3a) sobre `--bg` (#f6f8fb) — contraste > 14:1
- ✅ **Texto secundário:** `--muted` (#5a6477) sobre `--surface` (#fff) — contraste > 5.2:1
- ✅ **Primary sobre branco:** `--primary` (#124734) sobre branco — contraste > 10:1
- ✅ **Botão primário:** Texto branco sobre gradiente verde — contraste > 7:1
- ✅ **Dark mode texto:** `--text` (#eef5f1) sobre `--bg` (#101827) — contraste > 14:1
- ✅ **Dark mode primary:** `--primary` (#4ade80) sobre `--surface` (#121c2d) — alto contraste
- ✅ **Foco visível:** `:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px }`
- ✅ **Ring de input:** `box-shadow: 0 0 0 3px var(--ring)` no foco
- ✅ **Erro com texto:** Campos com erro mostram texto explicativo, não apenas borda vermelha
- ✅ **Badges legíveis:** Todas as variantes mantêm contraste texto/fundo adequado
- ✅ **Filtros ativos distinguíveis:** `.pill-active` usa fundo sólido, nitidamente diferente

### Boas práticas aplicadas

- Todos os estados semânticos (erro/sucesso/aviso) incluem ícone SVG + texto explicativo
- Disabled states usam `opacity: 0.6` + `cursor: not-allowed`
- Toasts incluem ícones diferenciados por tipo (`✓`, `⚠`, `✕`, `ℹ`)
- Transições suaves (`--transition-fast/base/slow`) para feedback visual imediato
- Seleção de texto usa `::selection { background: var(--primary-light) }`

---

## 9. Exemplos de Aplicação

### Botão primário
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: var(--on-primary);
  box-shadow: 0 8px 24px var(--primary-shadow);
}
```

### Input com foco
```css
.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--ring);
}
```

### Badge de destaque
```css
.badge-featured {
  background: var(--accent-light);
  color: var(--accent-2);
}
```

### Pill de filtro ativo
```css
.pill-active {
  background: var(--primary);
  color: var(--on-primary);
}
```

### Card acadêmico
```css
.academic-card {
  background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}
```

### Keyword / palavra-chave
```css
.keyword {
  background: var(--accent-light);
  color: var(--accent-2);
}
```

### Avatar de autor
```css
.author-avatar {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: var(--on-primary);
}
```

### Hero com gradiente
```css
.feed-hero {
  background: linear-gradient(135deg, var(--primary-light), var(--surface-2), var(--accent-light));
  border: 1px solid var(--primary-border);
}
```

---

## 10. Trabalhos Futuros

- **Modo de alto contraste:** Criar variante `html[data-theme='high-contrast']`
- **Validação color-blind:** Testar com simuladores de deuteranopia e protanopia
- **Design Tokens JSON:** Exportar tokens para integração cross-platform
- **Figma sync:** Manter biblioteca Figma sincronizada com tokens CSS
- **axe-core em CI:** Integrar testes automatizados de contraste nos testes E2E
- **Tema por campus:** Permitir personalização por campus mantendo a estrutura 60-30-10
- **Página de amostras:** Criar página interna de showcase de componentes para auditoria visual
- **Remover `style.css` legado:** O arquivo `frontend/src/style.css` não é importado pelo projeto e pode ser removido para evitar confusão
