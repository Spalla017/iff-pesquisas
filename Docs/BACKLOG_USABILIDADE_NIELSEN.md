# Backlog de Usabilidade - Heuristicas de Nielsen

Este backlog organiza as melhorias de usabilidade do IFF Pesquisas com base nas 10 Heuristicas de Jakob Nielsen. Ele registra o que foi concluido na etapa atual e o que permanece como trabalho futuro.

## Status da etapa

**Resultado:** Aprovado com ressalvas.

As melhorias principais foram aplicadas aos fluxos existentes, mas a documentacao nao deve afirmar conformidade absoluta. As ressalvas restantes estao registradas como pendencias priorizadas.

## Chat Interno por Colaboração

Cada solicitação de colaboração possui um chat de grupo próprio. O chat é criado quando o primeiro aluno demonstra interesse e novos interessados são adicionados ao mesmo grupo, mantendo a comunicação dentro da plataforma.

A colaboracao interdisciplinar nesta versao ocorre por meio de:

- criacao de solicitacao de colaboracao;
- indicacao de cursos desejados;
- indicacao de competencias necessarias;
- demonstracao de interesse;
- lista de interessados;
- chat de grupo vinculado ao projeto;
- gestao do status da solicitacao.

Essa decisao evita confundir "colaboracao estruturada" com "comunicacao direta genérica entre usuarios fora de projetos".

## Entregas concluidas

| Entrega | Heuristicas | Evidencia | Status |
|---|---|---|---|
| Matriz de avaliacao heuristica | H1-H10 | `Docs/HEURISTICAS_NIELSEN.md` | Concluida |
| Guia do usuario | H10 | `Docs/GUIA_USUARIO.md` | Concluida |
| Pagina "Como funciona" | H6, H10 | `frontend/src/pages/ComoFuncionaPage.vue` | Concluida |
| Indice de evidencias visuais | H10 | `Docs/evidencias/README.md` | Concluida |
| Padronizacao de linguagem visivel | H2, H4 | Header, paginas principais e README | Concluida parcialmente |
| Feedbacks de carregamento/sucesso/erro | H1, H4, H9 | Toasts, loadings, formularios e stores | Concluida parcialmente |
| Validacoes de formularios | H5, H9 | `frontend/src/schemas/index.ts` e formularios | Concluida |
| Filtros ativos removiveis | H1, H6, H7 | `SearchFilters.vue` e `ColaboracaoFilters.vue` | Concluida |
| Fluxo de interesse em colaboracao | H1, H3, H6 | `InteresseButton.vue` e `colaboracao.store.ts` | Concluida |
| Testes unitarios e E2E | H10 | Vitest e Playwright | Concluida |

## Pendencias priorizadas

| Prioridade | Pendencia | Heuristicas | Criterio de aceite futuro |
|---|---|---|---|
| Alta | Criar adaptador central de erros da API real | H1, H5, H9 | Nenhuma mensagem tecnica de backend aparece diretamente ao usuario |
| Alta | Padronizar modais de confirmacao em componente acessivel unico | H3, H4, H5, H9 | Exclusoes e acoes criticas usam o mesmo comportamento, foco e atributos ARIA |
| Media | Melhorar estados vazios com base nos filtros ativos | H6, H9, H10 | O usuario entende qual filtro remover ou alterar |
| Media | Revisar nomenclatura tecnica `post` em rotas, tipos e componentes | H2, H4 | A equipe decide entre migrar nomes ou documentar como legado interno |
| Media | Ampliar auditoria de teclado e foco | H7, H9 | Fluxos principais e modais sao navegaveis por teclado |
| Baixa | Reduzir icones/emojis decorativos | H8 | Elementos visuais decorativos nao competem com o conteudo academico |

## Trabalhos fora do escopo atual

Os itens abaixo nao devem ser tratados como pendencias da versao atual, salvo mudanca formal de escopo:

- Mensagens diretas avulsas (fora de projetos);
- Comentarios;
- Curtidas;
- Matchmaking automatico;
- Sistema de recomendacao automatica de colaboradores.

## Comandos de validacao

```bash
cd frontend
npm run build
npm run test:run
npm run e2e
```

## Uso academico

No TCC, este backlog pode ser usado para demonstrar o processo incremental de melhoria da interface, diferenciando:

- melhorias implementadas;
- melhorias parcialmente implementadas;
- limitacoes conscientes da versao atual;
- trabalhos futuros.
