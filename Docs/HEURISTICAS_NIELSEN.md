# Avaliacao Heuristica de Nielsen - IFF Pesquisas

## Objetivo

Este documento registra a etapa de adequacao do IFF Pesquisas as 10 Heuristicas de Usabilidade de Jakob Nielsen. A avaliacao tem finalidade tecnica e academica, servindo como evidencia para o TCC e para a continuidade do desenvolvimento.

O resultado desta etapa e **Aprovado com ressalvas**. As principais melhorias planejadas foram aplicadas nos fluxos existentes, mas ainda ha pontos documentados como trabalhos futuros. Portanto, este documento nao afirma aderencia absoluta.

## Escopo da versao atual

Foram avaliados os seguintes fluxos do front-end:

- Pagina inicial;
- Feed publico de pesquisas;
- Busca e filtros de pesquisas;
- Detalhes de pesquisa;
- Login e recuperacao de senha;
- Publicacao e edicao de pesquisa;
- Area "Minhas publicacoes";
- Listagem de colaboracoes entre cursos;
- Detalhes de solicitacao de colaboracao;
- Criacao de solicitacao de colaboracao;
- Demonstracao e remocao de interesse;
- Lista de interessados;
- Gestao de status da solicitacao;
- Pagina "Como funciona";
- Documentacao em `README.md` e `Docs/`.

## Chat Interno por Colaboração

Cada solicitação de colaboração possui um chat de grupo próprio. O chat é criado quando o primeiro aluno demonstra interesse e novos interessados são adicionados ao mesmo grupo, mantendo a comunicação dentro da plataforma.

Nesta versao, a colaboracao interdisciplinar ocorre por meio de:

- criacao de solicitacao de colaboracao;
- indicacao de cursos desejados;
- indicacao de competencias necessarias;
- demonstracao de interesse;
- lista de interessados;
- chat de grupo vinculado ao projeto;
- gestao do status da solicitacao.

Mensagens diretas avulsas entre usuários fora de projetos ou matchmaking automático seguem fora do escopo.

## Matriz geral

| No. | Heuristica | Status final | Evidencias principais | Ressalvas |
|---|---|---|---|---|
| 1 | Visibilidade do status do sistema | Atende parcialmente | Loadings, skeletons, progresso de upload, botoes desabilitados, toasts, `aria-live` | Feedbacks devem ser mantidos em futuras integracoes reais |
| 2 | Correspondencia com o mundo real | Atende parcialmente | Termos academicos em pesquisas, publicacoes, orientador, cursos e competencias | Rotas e tipos internos ainda preservam `post` por legado tecnico |
| 3 | Controle e liberdade do usuario | Atende parcialmente | Voltar, cancelar, confirmacao de exclusao, aviso de alteracoes nao salvas | Ainda nao ha acao de desfazer para exclusoes/despublicacoes |
| 4 | Consistencia e padroes | Atende parcialmente | Header, cards, filtros, toasts e formularios seguem padroes similares | Modais ainda nao usam um componente unico compartilhado |
| 5 | Prevencao de erros | Atende parcialmente | Zod, validacao de arquivos, e-mail institucional, competencias duplicadas, auth guard | Conversao de erros de backend real ainda e trabalho futuro |
| 6 | Reconhecimento em vez de recordacao | Atende parcialmente | Filtros ativos, chips removiveis, listas de cursos/areas, exemplos nos formularios | Estados vazios podem explicar melhor filtros ativos |
| 7 | Flexibilidade e eficiencia de uso | Atende parcialmente | Busca rapida com `Ctrl+K`, filtros com debounce, acoes diretas nos cards | Auditoria completa de teclado deve continuar em novas telas |
| 8 | Design estetico e minimalista | Atende parcialmente | Cards objetivos, hierarquia visual, responsividade e acoes principais claras | Uso pontual de icones/emojis pode ser reduzido |
| 9 | Ajuda para reconhecer, diagnosticar e recuperar erros | Atende parcialmente | Resumo de erros, mensagens em portugues, `aria-invalid`, `aria-describedby`, toasts | Alertas e erros de API real ainda podem ser padronizados |
| 10 | Ajuda e documentacao | Atende parcialmente | `GUIA_USUARIO.md`, pagina `/como-funciona`, backlog, evidencias visuais | Evidencias devem ser mantidas atualizadas a cada nova rodada |

## Problemas e ressalvas por severidade

| Severidade | Problema | Fluxos afetados | Heuristicas |
|---|---|---|---|
| Alta | Erros vindos de uma API real ainda precisam de adaptador para evitar mensagens tecnicas na interface | Login, publicacao, colaboracao, upload | H1, H5, H9 |
| Alta | Modais de confirmacao ainda nao estao totalmente padronizados em um componente acessivel unico | Exclusao de pesquisa e colaboracao | H3, H4, H5, H9 |
| Media | Estados vazios ainda podem explicar melhor quais filtros causaram ausencia de resultados | Feed, colaboracoes, minhas publicacoes | H6, H9, H10 |
| Media | Nomenclatura tecnica `post` permanece em rotas, tipos e nomes internos | Codigo e rotas | H2, H4 |
| Media | Evidencias visuais precisam continuar indexadas por heuristica quando novas telas forem adicionadas | Documentacao academica | H10 |
| Baixa | Uso pontual de icones ou emojis pode gerar ruido visual em telas academicas | Colaboracoes, detalhes e documentacao visual | H8 |

## H1 - Visibilidade do status do sistema

**Aplicacao:** o sistema deve informar quando esta carregando, filtrando, salvando, publicando, excluindo, alterando status ou registrando interesse.

**Evidencias:** `FeedPage.vue` exibe skeleton e anuncio de resultados; `CreatePostPage.vue` exibe progresso de upload; `CriarSolicitacaoPage.vue` desabilita o envio durante processamento; `ToastContainer.vue` centraliza feedbacks com `aria-live`; `InteresseButton.vue` mostra estado de processamento.

**Status:** Atende parcialmente.

**Ressalva:** feedbacks reais de upload e backend devem ser revisados quando houver API integrada.

## H2 - Correspondencia entre o sistema e o mundo real

**Aplicacao:** a interface deve usar linguagem familiar ao publico academico do IFF.

**Evidencias:** a navegacao e as paginas principais usam termos como pesquisa, publicacao, solicitacao de colaboracao, orientador, curso, competencias e interessados.

**Status:** Atende parcialmente.

**Ressalva:** nomes internos como `CreatePostPage`, `/criar-post` e `CreatePostPayload` permanecem como legado tecnico. Eles nao impedem o uso, mas devem ser documentados ou migrados futuramente.

## H3 - Controle e liberdade do usuario

**Aplicacao:** o usuario deve poder cancelar, voltar, corrigir dados e evitar acoes destrutivas acidentais.

**Evidencias:** formularios possuem cancelar/voltar; paginas internas tem links de retorno; exclusoes pedem confirmacao; formularios avisam sobre alteracoes nao salvas.

**Status:** Atende parcialmente.

**Ressalva:** ainda nao ha desfazer para exclusoes ou despublicacoes.

## H4 - Consistencia e padroes

**Aplicacao:** telas semelhantes devem usar padroes semelhantes de layout, texto, validacao e feedback.

**Evidencias:** componentes comuns de cards, filtros, botoes, inputs e toasts; stores separadas por dominio; rotas protegidas seguem guard de autenticacao.

**Status:** Atende parcialmente.

**Ressalva:** os modais de confirmacao ainda nao usam um componente compartilhado unico.

## H5 - Prevencao de erros

**Aplicacao:** o sistema deve impedir erros previsiveis antes do envio.

**Evidencias:** schemas Zod validam login, recuperacao, pesquisa e colaboracao; arquivos invalidos sao bloqueados por tipo/tamanho; competencias duplicadas sao rejeitadas; usuarios nao autenticados sao redirecionados antes de acoes restritas.

**Status:** Atende parcialmente.

**Ressalva:** a conversao de erros de backend real ainda precisa ser implementada.

## H6 - Reconhecimento em vez de recordacao

**Aplicacao:** a interface deve mostrar opcoes, contexto e proximos passos.

**Evidencias:** filtros ativos com chips removiveis; listas de areas e cursos; exemplos e dicas nos formularios; estados vazios com orientacao basica.

**Status:** Atende parcialmente.

**Ressalva:** estados vazios podem ser mais especificos quando houver filtros ativos.

## H7 - Flexibilidade e eficiencia de uso

**Aplicacao:** usuarios iniciantes e avancados devem conseguir realizar tarefas com eficiencia.

**Evidencias:** atalho `Ctrl+K`/`Cmd+K` para busca no feed; filtros com debounce; paginacao; acoes diretas nos cards e em "Minhas publicacoes".

**Status:** Atende parcialmente.

**Ressalva:** deve-se manter auditoria de teclado e foco em novas telas e modais.

## H8 - Design estetico e minimalista

**Aplicacao:** a interface deve destacar o conteudo principal e evitar excesso visual.

**Evidencias:** cards mostram informacoes essenciais; formularios sao segmentados; hierarquia visual e responsividade foram preservadas; acoes principais ficam visiveis.

**Status:** Atende parcialmente.

**Ressalva:** icones e emojis usados como decoracao podem ser reduzidos em uma rodada futura de refinamento visual.

## H9 - Ajuda para reconhecer, diagnosticar e recuperar erros

**Aplicacao:** erros devem ser claros, proximos ao campo e acionaveis.

**Evidencias:** formularios de pesquisa e colaboracao exibem resumo de erros; campos invalidos usam `aria-invalid` e `aria-describedby`; mensagens de schema estao em portugues; toasts informam falhas e sucessos.

**Status:** Atende parcialmente.

**Ressalva:** erros de API real devem passar por adaptador para evitar termos tecnicos como token, payload, stack trace ou codigo interno.

## H10 - Ajuda e documentacao

**Aplicacao:** usuarios e avaliadores devem entender os fluxos principais e as decisoes de escopo.

**Evidencias:** `Docs/GUIA_USUARIO.md`, `Docs/BACKLOG_USABILIDADE_NIELSEN.md`, `Docs/DECISOES_TECNICAS.md`, `Docs/evidencias/README.md`, `README.md` e pagina `/como-funciona`.

**Status:** Atende parcialmente.

**Ressalva:** a documentacao deve ser atualizada sempre que novas telas, evidencias ou integracoes forem adicionadas.

## Melhorias confirmadas

- Feedback visual e textual em carregamentos, filtros, publicacoes e acoes de interesse.
- Formularios com validacao por campo e resumo de erros.
- Validacao de arquivos e limites de tamanho.
- Filtros ativos e removiveis.
- Atalho de busca rapida.
- Fluxo de colaboracao interdisciplinar por solicitacao, competencias e interessados.
- Pagina "Como funciona" e guia do usuario.
- Evidencias visuais e videos em `Docs/evidencias/`.
- Testes unitarios e E2E cobrindo fluxos principais.

## Trabalhos futuros

1. Criar adaptador central de erros da API real.
2. Padronizar modais de confirmacao em componente unico acessivel.
3. Melhorar estados vazios com explicacao baseada nos filtros ativos.
4. Revisar nomenclatura tecnica `post` em rotas e tipos ou documentar como legado interno.
5. Ampliar auditoria de teclado e foco em modais.
6. Reduzir icones/emojis decorativos quando nao contribuirem para reconhecimento.
7. Manter o indice de evidencias por heuristica atualizado.

## Veredicto

**Aprovado com ressalvas.**

As melhorias principais de usabilidade foram aplicadas e documentadas nos fluxos existentes. As ressalvas restantes nao impedem a entrega da versao atual, mas devem ser registradas no TCC como limitacoes e trabalhos futuros.
