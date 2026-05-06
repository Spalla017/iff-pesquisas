# 🧪 Relatório Completo de Testes — IFF Pesquisas

Testado em: 29/04/2026, ~22:30  
Ambiente: `npm run dev` (Vite 8.0.10), porta 5174  
Navegador: Chromium (via browser agent)

---

## Resumo Executivo

| Categoria | Testes | ✅ Passou | ❌ Falhou | ⚠️ Parcial |
|---|---|---|---|---|
| Home Page | 13 | 12 | 0 | 1 |
| Feed Page | 17 | 17 | 0 | 0 |
| Login Page | 14 | 11 | 2 | 1 |
| Detail Page | 7 | 7 | 0 | 0 |
| Create Post | 12 | 10 | 1 | 1 |
| My Posts | 6 | 6 | 0 | 0 |
| 404 Page | 4 | 4 | 0 | 0 |
| Auth Guards | 4 | 4 | 0 | 0 |
| Mobile/Responsivo | 5 | 5 | 0 | 0 |
| **Total** | **82** | **76** | **3** | **3** |

---

## 🐛 Bugs Encontrados

### BUG 1 — Palavras-chave: campo não limpa ao rejeitar duplicata (Severidade: Média)

**Localização:** `CreatePostPage.vue`, função `adicionarPalavraChave()`  
**Reprodução:**
1. No formulário de criar post, digite "keyword1" e pressione Enter → tag adicionada ✓
2. Digite "keyword1" novamente e pressione Enter → duplicata corretamente rejeitada ✓
3. **O problema:** o campo de input NÃO é limpo quando a duplicata é rejeitada
4. O usuário então digita "keyword2" e pressiona Enter → o texto concatenado "keyword1keyword2" é adicionado como tag

**Causa raiz:** Na função `adicionarPalavraChave()`, o `novaPalavraChave.value = ''` só é executado dentro do `if` quando a keyword é aceita. Quando é rejeitada (duplicata ou limite atingido), o campo mantém o texto.

**Correção proposta:**
```diff
  const adicionarPalavraChave = () => {
    const kw = novaPalavraChave.value.trim();
    const jaExiste = form.value.palavrasChave.some(
      palavra => palavra.toLocaleLowerCase('pt-BR') === kw.toLocaleLowerCase('pt-BR'),
    );

    if (kw && form.value.palavrasChave.length < 5 && !jaExiste) {
      form.value.palavrasChave.push(kw);
-     novaPalavraChave.value = '';
    }
+   novaPalavraChave.value = '';
  };
```

---

### BUG 2 — Login: sem mensagem de erro para senha curta (Severidade: Baixa)

**Localização:** `auth.store.ts`, função `usarLoginDev()`  
**Reprodução:**
1. Na tela de login, digite "aluno@iff.edu.br" e senha "abc" (3 caracteres)
2. Clique "Entrar"
3. **O problema:** o login dev requer `senha.length >= 4`, mas quando essa condição falha, o sistema tenta fazer login via API (que não está rodando), resultando em erro genérico "Erro ao fazer login" em vez de uma mensagem específica como "Senha deve ter no mínimo 4 caracteres"

**Causa raiz:** Quando `usarLoginDev()` retorna `false` (por senha curta), o fluxo cai no `api.post('/auth/login')` que falha por falta de backend, gerando um erro de conexão pouco informativo.

**Correção proposta:** Adicionar validação explícita antes do login:
```diff
  const login = async (payload: LoginPayload) => {
    carregando.value = true;
    erro.value = null;

    try {
+     // Validação básica
+     if (payload.senha.trim().length < 4) {
+       erro.value = 'A senha deve ter no mínimo 4 caracteres.';
+       return false;
+     }
+
      if (usarLoginDev(payload)) {
```

---

### BUG 3 — Login: sem validação de e-mail institucional no frontend (Severidade: Baixa)

**Localização:** `LoginPage.vue` / `auth.store.ts`  
**Reprodução:**
1. Digite "user@gmail.com" e "1234" na tela de login
2. Clique "Entrar"
3. **O problema:** o sistema tenta fazer login via API (falha por falta de backend) e mostra "Erro ao fazer login" — deveria mostrar "Use um e-mail institucional (@iff.edu.br)"

**Correção proposta:** Adicionar validação de domínio antes do login:
```diff
      // Validação de domínio institucional
+     if (!payload.email.trim().toLowerCase().endsWith('@iff.edu.br')) {
+       erro.value = 'Use seu e-mail institucional (@iff.edu.br).';
+       return false;
+     }
```

---

## ⚠️ Problemas Menores / Observações

### 1. Arquivo `.env` ausente
O projeto tem `.env.example` mas não `.env`. O login dev funciona porque `import.meta.env.DEV` é `true` e `VITE_USE_API_AUTH` é `undefined` (que passa o check `!== 'true'`), mas é melhor prática ter o `.env` criado.

### 2. "Meus Posts" mostra posts de todos os usuários
A página `MyPostsPage.vue` usa `pesquisaStore.todasPesquisas.slice(0, 4)` — exibe os 4 primeiros posts do acervo independente do usuário logado. Isso é esperado (mock), mas deveria ser documentado ou ter um comentário mais visível.

### 3. Botão "Publicar pesquisa" redireciona para login quando deslogado
Isso é o comportamento correto (auth guard), mas não há feedback visual (toast/snackbar) informando ao usuário POR QUE foi redirecionado. O usuário pode ficar confuso.

### 4. Link "Baixar PDF" aponta para "#"
Todos os PDFs mock usam `pdfUrl: '#'`, então clicar no botão "Baixar PDF" não faz nada visível. Esperado em modo mock, mas em produção precisará apontar para URLs reais.

### 5. HelloWorld.vue não utilizado
O componente `HelloWorld.vue` do template padrão do Vue ainda existe no projeto mas não é usado em nenhum lugar.

---

## ✅ Testes Detalhados por Página

### Home Page (`/`)
| # | Teste | Resultado |
|---|---|---|
| 1 | Página carrega sem erros | ✅ |
| 2 | Header: brand "IFF Pesquisas" visível | ✅ |
| 3 | Header: links Início, Explorar, Entrar | ✅ |
| 4 | Hero: heading, descrição e barra de busca | ✅ |
| 5 | Busca: digitar "IoT" e clicar Buscar → navega para /feed?q=IoT | ✅ |
| 6 | Painel lateral: "pesquisas catalogadas", áreas, última publicação | ✅ |
| 7 | Link "Ver detalhes" no destaque → navega para detalhe | ✅ |
| 8 | Seção "Últimas pesquisas" com PesquisaCards | ✅ |
| 9 | Seção "Navegação por área" com contadores | ✅ |
| 10 | Clicar área → navega para /feed?area=X | ✅ |
| 11 | Botão "Explorar acervo" → /feed | ✅ |
| 12 | Botão "Publicar pesquisa" → /login (sem auth) | ✅ |
| 13 | Responsividade em 768px | ⚠️ Funcional, mas busca fica apertada |

### Feed Page (`/feed`)
| # | Teste | Resultado |
|---|---|---|
| 1 | Página carrega com hero, filtros e cards | ✅ |
| 2 | Stats: total de pesquisas e áreas corretos | ✅ |
| 3 | Buscar "Arduino" → filtra corretamente | ✅ |
| 4 | Limpar busca (X) → todos retornam | ✅ |
| 5 | Filtro por área "Saúde" → 2 resultados | ✅ |
| 6 | Pill "Todas" limpa filtro de área | ✅ |
| 7 | Filtros combinados (área + busca) | ✅ |
| 8 | "Mais filtros" expande filtros avançados | ✅ |
| 9 | Filtro por orientador funciona | ✅ |
| 10 | Tags de filtros ativos com botão × | ✅ |
| 11 | "Limpar filtros" reseta tudo | ✅ |
| 12 | Paginação: 6 por página, botões anterior/próxima | ✅ |
| 13 | Números de página clicáveis | ✅ |
| 14 | Empty state com busca inexistente | ✅ |
| 15 | Botão "Limpar todos os filtros" no empty state | ✅ |
| 16 | Card → navega para /pesquisa/:id | ✅ |
| 17 | Query params (?q= e ?area=) funcionam no carregamento | ✅ |

### Login Page (`/login`)
| # | Teste | Resultado |
|---|---|---|
| 1 | Layout split panel + formulário | ✅ |
| 2 | Marca institucional IFF + "Acesso institucional" | ✅ |
| 3 | Features grid (3 itens) | ✅ |
| 4 | Validação nativa de campo vazio | ✅ |
| 5 | Toggle mostrar/ocultar senha | ✅ |
| 6 | Login com email não-IFF → erro | ❌ Erro genérico (BUG 3) |
| 7 | Login com senha curta (3 chars) → erro | ❌ Erro genérico (BUG 2) |
| 8 | Login dev com @iff.edu.br + 4+ chars | ✅ |
| 9 | Redirect para /feed após login | ✅ |
| 10 | Header mostra user chip após login | ✅ |
| 11 | Botão "Sair" funciona | ✅ |
| 12 | Link "Voltar para a home" | ✅ |
| 13 | Guest guard: logado → /login redireciona para /feed | ✅ |
| 14 | Responsividade em 768px | ⚠️ Funcional |

### Detail Page (`/pesquisa/:id`)
| # | Teste | Resultado |
|---|---|---|
| 1 | Pesquisa existente carrega corretamente | ✅ |
| 2 | Hero com área, data, status, autores | ✅ |
| 3 | Botão "Baixar PDF" quando disponível | ✅ |
| 4 | "PDF indisponível" quando sem PDF (id=8) | ✅ |
| 5 | Pesquisa inexistente (id=999) → erro | ✅ |
| 6 | Sidebar com info card e CTA card | ✅ |
| 7 | "Voltar ao feed" → navega para /feed | ✅ |

### Create Post (`/criar-post`)
| # | Teste | Resultado |
|---|---|---|
| 1 | Require auth guard (redireciona para login) | ✅ |
| 2 | Formulário com todos os campos | ✅ |
| 3 | Checklist atualiza ao preencher campos | ✅ |
| 4 | Botão desabilitado com campos vazios | ✅ |
| 5 | Upload zone drag & drop (visual) | ✅ |
| 6 | Sidebar com dicas e checklist | ✅ |
| 7 | Adicionar palavras-chave com Enter | ✅ |
| 8 | Limite de 5 palavras-chave | ✅ |
| 9 | Rejeição de duplicatas | ⚠️ Rejeita, mas não limpa campo (BUG 1) |
| 10 | Remover palavra-chave (×) | ✅ |
| 11 | Publicação com sucesso | ✅ |
| 12 | Contador de caracteres | ✅ |

### My Posts (`/meus-posts`)
| # | Teste | Resultado |
|---|---|---|
| 1 | Require auth guard | ✅ |
| 2 | Header com métricas e botão "Nova pesquisa" | ✅ |
| 3 | Lista de posts com tags e ações | ✅ |
| 4 | Modal de confirmação de exclusão | ✅ |
| 5 | Cancelar exclusão fecha modal | ✅ |
| 6 | Botão "Ver" navega para detalhe | ✅ |

### 404 Page
| # | Teste | Resultado |
|---|---|---|
| 1 | Rota inexistente mostra 404 | ✅ |
| 2 | Código "404" estilizado com gradiente | ✅ |
| 3 | Botão "Voltar para home" | ✅ |
| 4 | Botão "Explorar pesquisas" | ✅ |

### Auth Guards & Navigation
| # | Teste | Resultado |
|---|---|---|
| 1 | /criar-post sem login → /login | ✅ |
| 2 | /meus-posts sem login → /login | ✅ |
| 3 | /login com login → /feed | ✅ |
| 4 | Todas as rotas do header funcionam | ✅ |

### Mobile / Responsividade
| # | Teste | Resultado |
|---|---|---|
| 1 | Menu hamburger aparece em ≤900px | ✅ |
| 2 | Drawer abre e fecha corretamente | ✅ |
| 3 | Links do drawer navegam e fecham drawer | ✅ |
| 4 | Feed em mobile: grid 1 coluna | ✅ |
| 5 | Footer em mobile: 1 coluna | ✅ |

---

## 💡 Sugestões de Melhorias

### Prioridade Alta (Impacto direto na UX)

1. **🔒 Validação de login aprimorada** — Adicionar mensagens específicas para e-mail não-institucional e senha curta antes de tentar a API
2. **📋 Criar `.env` a partir do `.env.example`** — Para documentar e padronizar as variáveis de ambiente
3. **🔔 Toast/Snackbar de feedback** — Quando o auth guard redireciona, mostrar uma notificação "Faça login para acessar esta página"
4. **📝 Página de recuperação de senha** — Mencionada no plano mas não implementada
5. **✏️ Edição de posts** — Mencionada na Semana 7 do plano mas não implementada

### Prioridade Média (Polimento)

6. **🔍 Debounce visual** — Adicionar skeleton loading nos cards durante o debounce da busca
7. **📄 Meta tags SEO** — O `index.html` tem um título genérico "Vite App", deveria ser "IFF Pesquisas — Plataforma de Pesquisas de Extensão"
8. **🗑️ Remover HelloWorld.vue** — Componente residual do template não utilizado
9. **🎨 Imagens de capa nos mock data** — Todos os mocks têm `imagemUrl: ''`, adicionar imagens para demonstrar visualmente os cards com imagem
10. **📱 Scroll-to-top ao navegar** — Ao trocar de página, o scroll não volta ao topo automaticamente (exceto na paginação do feed)

### Prioridade Baixa (Nice to have)

11. **🌙 Dark mode** — Implementar tema escuro com toggle
12. **⌨️ Atalhos de teclado** — Ex: Ctrl+K para busca global
13. **📊 Animação de contadores** — Animar os números no painel da Home (contagem incremental)
14. **🔗 Compartilhar pesquisa** — Botão de copiar link / compartilhar em redes
15. **📥 Confirmar antes de sair do formulário** — Se o formulário de criação tem dados preenchidos e o usuário tenta navegar, mostrar confirmação
16. **♿ Anúncio de região live** — Usar `aria-live` para anunciar resultados de filtro para leitores de tela
17. **🖼️ Lazy loading de imagens** — Adicionar `loading="lazy"` nas imagens dos cards quando houver imagens reais

