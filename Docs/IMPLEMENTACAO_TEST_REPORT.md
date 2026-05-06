# Implementação das Sugestões do `test_report.md`

Data da implementação: 06/05/2026  
Projeto: IFF Pesquisas  
Escopo: frontend Vue 3 + TypeScript + Vite

## Resumo

Esta rodada implementou correções e melhorias apontadas no arquivo `test_report.md`, priorizando bugs de UX, validação de autenticação, feedback de navegação, polimento visual do feed e fluxos que estavam previstos no plano do projeto.

Também foram adicionadas melhorias complementares de acessibilidade e usabilidade, como `aria-live`, compartilhamento de pesquisa, confirmação antes de sair do formulário, atalho global de busca e tema escuro.

## Correções de Bugs

### 1. Campo de palavras-chave não limpava após duplicata

Arquivo alterado:

- `frontend/src/pages/CreatePostPage.vue`

Antes, ao tentar adicionar uma palavra-chave duplicada, o campo permanecia preenchido. Isso permitia que o próximo texto digitado fosse concatenado indevidamente.

Agora o campo é limpo sempre que o usuário pressiona Enter, mesmo quando a palavra-chave é rejeitada por duplicidade ou limite.

### 2. Login com senha curta mostrava erro genérico

Arquivo alterado:

- `frontend/src/stores/auth.store.ts`

Foi adicionada validação explícita antes da tentativa de login:

- Senhas com menos de 4 caracteres exibem: `A senha deve ter no mínimo 4 caracteres.`

### 3. Login com e-mail não institucional mostrava erro genérico

Arquivo alterado:

- `frontend/src/stores/auth.store.ts`

Foi adicionada validação de domínio institucional antes de tentar login via API:

- E-mails fora de `@iff.edu.br` exibem: `Use seu e-mail institucional (@iff.edu.br).`

## Configuração de Ambiente

Arquivo criado localmente:

- `frontend/.env`

Conteúdo baseado em `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_USE_API_AUTH=false
```

Observação: o arquivo `.env` é ignorado pelo Git, então ele não aparece como arquivo versionado.

## Feedback Global e Navegação

### Toast/Snackbar global

Arquivos criados:

- `frontend/src/stores/toast.store.ts`
- `frontend/src/components/common/ToastContainer.vue`

Arquivo alterado:

- `frontend/src/App.vue`

Foi criada uma store global de notificações com suporte aos tipos:

- `info`
- `success`
- `warning`
- `danger`

O container global de toasts foi conectado no `App.vue`.

### Feedback no auth guard

Arquivo alterado:

- `frontend/src/router/index.ts`

Quando o usuário tenta acessar uma rota protegida sem autenticação, agora aparece a mensagem:

```text
Faça login para acessar esta página.
```

Além disso, o redirecionamento guarda a rota original em `redirect`, permitindo voltar para a página pretendida após login.

### Redirect após login

Arquivo alterado:

- `frontend/src/pages/LoginPage.vue`

Após login bem-sucedido, o usuário é redirecionado para:

- A rota original, quando veio de um auth guard.
- `/feed`, quando acessou o login diretamente.

### Scroll-to-top

Arquivo alterado:

- `frontend/src/router/index.ts`

Foi adicionado `scrollBehavior` ao router para retornar ao topo ao navegar entre páginas, preservando posições salvas quando aplicável.

## Feed, Cards e Dados Mock

### Skeleton durante busca/debounce

Arquivo alterado:

- `frontend/src/pages/FeedPage.vue`

O feed agora mostra skeleton cards enquanto:

- A busca está em debounce.
- A store está carregando resultados.

Isso evita sensação de travamento durante filtros e busca textual.

### Anúncio acessível dos resultados

Arquivo alterado:

- `frontend/src/pages/FeedPage.vue`

Foi adicionado texto com `aria-live="polite"` para anunciar a quantidade de pesquisas encontradas a leitores de tela.

### Imagens de capa nos mocks

Arquivo alterado:

- `frontend/src/data/mockPesquisas.ts`

Os mocks agora possuem `imagemUrl`, permitindo demonstrar cards e página de detalhes com imagem de capa.

### Lazy loading de imagens

Arquivos alterados:

- `frontend/src/components/common/PesquisaCard.vue`
- `frontend/src/pages/PesquisaDetailPage.vue`

As imagens agora usam:

```html
loading="lazy"
```

### PDFs mock funcionais

Arquivo alterado:

- `frontend/src/data/mockPesquisas.ts`

Os valores `pdfUrl: '#'` foram substituídos por uma URL demo de PDF, evitando botões que apontavam para `#`.

Também foi mantido o tratamento para PDF indisponível quando `pdfUrl` estiver vazio.

## Novos Fluxos

### Recuperação de senha

Arquivo criado:

- `frontend/src/pages/RecoverPasswordPage.vue`

Arquivo alterado:

- `frontend/src/router/index.ts`
- `frontend/src/pages/LoginPage.vue`

Nova rota:

```text
/recuperar-senha
```

O fluxo valida e-mail institucional e simula envio de instruções com feedback visual.

### Edição de posts

Arquivos alterados:

- `frontend/src/router/index.ts`
- `frontend/src/pages/CreatePostPage.vue`
- `frontend/src/pages/MyPostsPage.vue`
- `frontend/src/stores/pesquisa.store.ts`
- `frontend/src/types/index.ts`

Nova rota:

```text
/editar-post/:id
```

O formulário de criação foi reaproveitado para edição, com:

- Preenchimento dos dados existentes.
- Alteração de título, resumo, área, orientador e palavras-chave.
- Atualização de imagem.
- Preservação de imagem/PDF existentes quando não alterados.
- Botão `Editar` em `Meus posts`.

## Melhorias de Usabilidade

### Confirmação antes de sair do formulário

Arquivo alterado:

- `frontend/src/pages/CreatePostPage.vue`

Quando o formulário possui alterações não salvas, o usuário recebe confirmação antes de sair da rota ou fechar/recarregar a página.

### Compartilhar pesquisa

Arquivo alterado:

- `frontend/src/pages/PesquisaDetailPage.vue`

Foi adicionado botão `Compartilhar`.

Comportamento:

- Usa `navigator.share` quando disponível.
- Caso contrário, copia o link da página para a área de transferência.
- Exibe toast de sucesso ou erro.

### Atalho global de busca

Arquivo alterado:

- `frontend/src/App.vue`

Atalho implementado:

```text
Ctrl+K
```

ou, em sistemas compatíveis:

```text
Cmd+K
```

O atalho navega para `/feed` e foca o campo de busca.

### Contadores animados na Home

Arquivo alterado:

- `frontend/src/pages/HomePage.vue`

Os números do painel da Home agora animam ao carregar a página.

### Dark mode

Arquivos alterados:

- `frontend/src/components/layout/Header.vue`
- `frontend/src/styles/globals.css`

Foi adicionado toggle de tema claro/escuro no Header.

O tema selecionado é persistido em `localStorage` usando a chave:

```text
theme
```

Quando não existe preferência salva, o sistema respeita `prefers-color-scheme`.

## Limpeza

Arquivo removido:

- `frontend/src/components/HelloWorld.vue`

O componente era residual do template inicial do Vue e não era utilizado.

## Validações Executadas

### Build de produção

Comando executado:

```bash
npm run build
```

Resultado:

```text
✓ built
```

Observação: no ambiente atual, o build precisou ser executado fora do sandbox por uma falha `EPERM` do Vite ao carregar a configuração. Fora do sandbox, a compilação foi concluída com sucesso.

### Verificação de diff

Comando executado:

```bash
git diff --check
```

Resultado:

```text
Sem erros
```

### Smoke test local

Servidor Vite iniciado em:

```text
http://127.0.0.1:5173/
```

Teste HTTP local:

```text
Status 200
```

## Arquivos Principais Alterados

- `frontend/src/App.vue`
- `frontend/src/components/common/PesquisaCard.vue`
- `frontend/src/components/common/ToastContainer.vue`
- `frontend/src/components/layout/Header.vue`
- `frontend/src/data/mockPesquisas.ts`
- `frontend/src/pages/CreatePostPage.vue`
- `frontend/src/pages/FeedPage.vue`
- `frontend/src/pages/HomePage.vue`
- `frontend/src/pages/LoginPage.vue`
- `frontend/src/pages/MyPostsPage.vue`
- `frontend/src/pages/PesquisaDetailPage.vue`
- `frontend/src/pages/RecoverPasswordPage.vue`
- `frontend/src/router/index.ts`
- `frontend/src/stores/auth.store.ts`
- `frontend/src/stores/pesquisa.store.ts`
- `frontend/src/stores/toast.store.ts`
- `frontend/src/styles/globals.css`
- `frontend/src/types/index.ts`

## Próximos Passos Recomendados

1. Fazer uma rodada visual/manual completa no navegador seguindo novamente o `test_report.md`.
2. Validar responsividade após imagens de capa e dark mode.
3. Criar testes automatizados para:
   - Login inválido.
   - Auth guard com toast.
   - Adição de palavras-chave duplicadas.
   - Edição de post.
   - Recuperação de senha.
4. Integrar os fluxos de criação, edição, recuperação de senha e upload com o backend Laravel quando a API estiver pronta.
5. Substituir URLs externas de imagens/PDFs mock por assets próprios ou dados reais da API.
