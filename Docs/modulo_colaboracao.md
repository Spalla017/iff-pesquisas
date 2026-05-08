# Documentação: Módulo de Colaboração Intercursos

## 1. Visão Geral
A plataforma **IFF Pesquisas** foi expandida além de um repositório passivo, ganhando um módulo ativo de **Colaboração Intercursos**. O objetivo é permitir que alunos publiquem projetos (que estão em andamento ou em fase de planejamento) solicitando ajuda e expertise de outros cursos do IFF Campus Itaperuna, promovendo a interdisciplinaridade.

---

## 2. O que já foi implementado (Concluído)

A base estrutural, de dados e de interface do módulo já está 100% implementada e funcional no front-end. As seguintes camadas foram desenvolvidas:

### 2.1. Modelagem de Dados e Tipos (`frontend/src/types/index.ts`)
Foram criados os contratos (interfaces) para suportar a nova funcionalidade:
- **`Colaboracao`**: Entidade principal contendo título, descrição, curso de origem, cursos desejados, área, status (aberta/em andamento/concluída/cancelada) e urgência.
- **`InteresseColaboracao`**: Modelo para rastrear alunos interessados (quem demonstrou interesse e quando).
- **`FiltrosColaboracao`**: Tipagem para o sistema avançado de buscas.
- Modificação na interface `Usuario`: Adicionado o campo `curso`.

### 2.2. Validação e Segurança (`frontend/src/schemas/index.ts`)
- Implementado o schema Zod `createColaboracaoSchema` para garantir a integridade dos dados no formulário (ex: mínimo de caracteres no título, validação do enum de urgência, cursos limitados, etc.).

### 2.3. Gerenciamento de Estado (`frontend/src/stores/colaboracao.store.ts`)
Criada uma store Pinia totalmente independente do módulo de pesquisas para lidar com:
- Persistência de dados via `localStorage` simulando um banco de dados real.
- Funções CRUD completas: criar colaboração, alterar status, deletar e buscar por ID.
- Mecânica de demonstração de interesse (toggle de interessado/não interessado) vinculada ao usuário autenticado.
- Lógica complexa de filtros cruzados e busca textual.

### 2.4. Componentes de UI Reutilizáveis
- **`ColaboracaoCard.vue`**: Card rico em informações visuais exibindo badges de urgência, áreas, cursos e um resumo das competências exigidas.
- **`ColaboracaoFilters.vue`**: Painel lateral contendo 5 selects (filtros paramétricos) e uma barra de busca por texto com debounce.
- **`InteresseButton.vue`**: Botão animado de ação principal da plataforma, que muda de estado dependendo se o usuário já demonstrou interesse ou não, bloqueando a ação para usuários não logados.

### 2.5. Páginas (`frontend/src/pages/`)
- **`ColaboracoesPage.vue`**: Feed principal (Explore) listando os cards, com integração direta aos filtros e sistema de paginação dinâmico.
- **`ColaboracaoDetailPage.vue`**: Tela de detalhes do projeto, contendo a lista visível de alunos interessados e botões de gerenciamento (se o usuário for o autor).
- **`CriarSolicitacaoPage.vue`**: Formulário de criação robusto com seleção múltipla de cursos e input interativo de "tags" para competências necessárias.

### 2.6. Integrações Globais
- **Home Page**: Adicionada uma seção *Call To Action* interativa entre a área de pesquisas recentes e áreas de conhecimento.
- **Roteamento**: Adicionadas rotas limpas e lazy-loaded no `vue-router` (`/colaboracoes`, `/colaboracoes/:id`, `/solicitar-colaboracao`).
- **Navegação**: Inclusão de links diretos no Header (cabeçalho) e Footer (rodapé).

---

## 3. Correções Realizadas (Bugfixes Recentes)
Durante nossa sessão inicial de testes QA, encontramos e corrigimos os seguintes pontos de usabilidade:
- **Debounce de Busca:** Evita que os filtros recalculem a cada milissegundo enquanto o usuário digita na barra de pesquisa.
- **Desacoplamento:** Constantes dependentes (como `AREAS_DISPONIVEIS`) foram duplicadas corretamente para o mock de colaboração para evitar dependência rígida da estrutura legada.
- **Validação Reativa no Formulário:** Erros de validação do formulário de criação agora somem em tempo real no momento que o usuário começa a digitar a correção (através de watchers do Vue).

---

## 4. O que falta fazer (Próximos Passos)

Ainda temos as Fases 2 e 3 do nosso planejamento em aberto, focadas em estabilidade a longo prazo (Testes) e refinamento final da experiência do usuário (UX):

### Fase 2: Bateria de Testes Unitários (Vitest)
O projeto TCC precisa manter 100% de confiabilidade. Faltam ser criados os arquivos de testes para o novo módulo:
- `colaboracao.store.spec.ts`: Testar se a persistência funciona, se os filtros retornam os dados certos e se a mecânica de interesse (adicionar/remover) funciona e barra ações inválidas.
- `colaboracao.schema.spec.ts`: Garantir que strings vazias e dados inválidos são barrados no nível de formulário.
- `ColaboracaoCard.spec.ts`: Garantir que os cards renderizem as cores certas dependendo da "urgência" e "status".

### Fase 3: Polimento Final de UX
- Adicionar no `globals.css` aliases para as variáveis de cor (`--accent-bg`, `--accent-border`) garantindo que o módulo renderize de forma perfeita independente se o usuário usar o Tema Claro ou Tema Escuro.
- Fazer o "Card" da lista de colaborações ser clicável como um todo (e não apenas o link "Ver detalhes").
- Adicionar uma contagem dinâmica e colorida aos campos do formulário (ex: "74/150 caracteres" ficar vermelho se estourar).
- Implementar um `beforeRouteLeave` para evitar que o aluno perca o formulário caso feche a tela sem querer enquanto estiver digitando uma solicitação grande.
