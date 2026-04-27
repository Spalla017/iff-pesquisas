# Plano Executivo - TCC
## Evolucao do Projeto: Plataforma para Divulgacao de Pesquisas de Extensao

## 1. Identificacao do Projeto
- Titulo do TCC: Planejamento e Desenvolvimento do Front-end de uma Plataforma Academica para Divulgacao de Pesquisas de Extensao.
- Instituicao: Instituto Federal Fluminense - Campus Itaperuna.
- Base documental: Projeto Luiz Claudio (Final).
- Natureza: Evolucao tecnica de projeto academico para entrega de TCC.
- Recorte deste plano: Planejamento executivo do front-end.

## 2. Resumo Executivo
Este plano executivo define como o front-end da plataforma academica sera implementado, validado e entregue como produto principal do TCC. O sistema tem como objetivo centralizar e dar visibilidade as pesquisas de extensao, oferecendo uma area publica para consulta e uma area autenticada para publicacao de conteudo.

A proposta prioriza usabilidade, responsividade, acessibilidade, consistencia visual, qualidade tecnica e aderencia aos requisitos ja definidos no projeto original. Ao final, espera-se uma interface funcional, moderna e pronta para integracao com o backend Laravel e a API RESTful.

## 3. Contexto, Problema e Oportunidade
### 3.1 Problema
Atualmente, nao existe um repositorio digital unificado e de facil acesso para divulgacao das pesquisas de extensao. Isso reduz a visibilidade dos trabalhos e limita o acesso publico ao conhecimento produzido na instituicao.

### 3.2 Oportunidade
A evolucao do projeto para TCC permite transformar o planejamento inicial em implementacao real do front-end, com foco em experiencia do usuario, acesso aberto ao conhecimento e suporte ao fluxo institucional de autenticacao/publicacao.

### 3.3 Justificativa Academica
- Relevancia social: ampliacao do acesso a producao academica.
- Relevancia tecnica: construcao de SPA com boas praticas de engenharia de software.
- Relevancia institucional: fortalecimento da cultura de extensao e transparencia.

## 4. Objetivos
### 4.1 Objetivo Geral
Projetar, implementar e validar o front-end de uma plataforma academica para divulgacao de pesquisas de extensao, atendendo aos requisitos funcionais e nao funcionais definidos no projeto base.

### 4.2 Objetivos Especificos
1. Estruturar a arquitetura front-end em Vue.js com componentes reutilizaveis.
2. Desenvolver fluxo de autenticacao institucional para area restrita.
3. Implementar feed publico com filtros e busca.
4. Construir formularios de postagem e upload com validacoes.
5. Garantir responsividade para desktop e mobile.
6. Aplicar diretrizes minimas de acessibilidade.
7. Integrar o front-end com API RESTful.
8. Executar testes funcionais e de aceitacao dos fluxos criticos.

## 5. Escopo Executivo do Front-end
### 5.1 Entregas Incluidas
1. Interface publica:
- Pagina inicial com acesso ao feed de pesquisas.
- Listagem de posts com filtros por area, orientador/aluno e palavras-chave.
- Pagina de detalhes da pesquisa.
- Acao de download do PDF quando disponivel.

2. Interface autenticada:
- Tela de login institucional.
- Recuperacao de senha.
- Tela de criacao de post.
- Fluxo de upload de PDF e imagem.
- Tela de listagem de posts do usuario (meus posts).

3. Estrutura de navegacao:
- Rotas publicas e protegidas.
- Guardas de autenticacao.
- Layout responsivo com navegacao clara.

4. Qualidade e padronizacao:
- Design tokens (cores, tipografia, espacamentos, estados).
- Padrao de componentes reutilizaveis.
- Tratamento de estados de carregamento, vazio e erro.

### 5.2 Escopo Excluido (neste ciclo do TCC)
- Chat entre usuarios.
- Comentarios e curtidas.
- Mensageria interna.
- Moderacao avancada por IA.
- Aplicativo mobile nativo.

## 6. Requisitos do Produto (Front-end)
### 6.1 Requisitos Funcionais
1. Visitante sem login deve conseguir visualizar feed e detalhes de pesquisa.
2. Usuario autenticado deve conseguir criar post com campos obrigatorios.
3. Sistema deve permitir upload de PDF e imagem (conforme regras da API).
4. Sistema deve permitir filtragem por area, autores/orientador e texto.
5. Sistema deve exibir mensagens de sucesso/falha em operacoes relevantes.

### 6.2 Requisitos Nao Funcionais
1. Responsividade: interface funcional em mobile, tablet e desktop.
2. Acessibilidade: navegacao por teclado, foco visivel e contraste adequado.
3. Desempenho: carregamento inicial otimizado e paginacao no feed.
4. Confiabilidade: tratamento consistente de erros de rede/API.
5. Manutenibilidade: arquitetura modular e padrao de codigo documentado.

## 7. Arquitetura e Decisoes Tecnicas
### 7.1 Stack Recomendada
- Framework: Vue 3.
- Linguagem: TypeScript.
- Estado global: Pinia.
- Roteamento: Vue Router.
- Consumo de API: Axios.
- Validacao de formularios: VeeValidate + Zod.
- Estilo: CSS com design tokens e convencoes de componentes.
- Testes: Vitest (unitario) + Cypress/Playwright (E2E).

### 7.2 Padrao de Estrutura
- Camadas de interface, dominio (regras de tela) e servicos (API).
- Componentes atomicos reutilizaveis para formularios, cards e feedbacks.
- Centralizacao de configuracao HTTP (headers, token, interceptors).

### 7.3 Principios
- Simplicidade na navegacao.
- Clareza de feedback ao usuario.
- Reutilizacao de componentes.
- Evolucao incremental com entregas semanais.

## 8. Metodologia de Execucao
### 8.1 Abordagem
Metodo iterativo-incremental em sprints semanais, com backlog priorizado por valor e risco.

### 8.2 Fluxo de Trabalho
1. Planejar sprint.
2. Refinar historias e criterios de aceite.
3. Desenvolver componentes/telas.
4. Integrar com API.
5. Testar (unitario + funcional).
6. Demonstrar incremento e registrar ajustes.

### 8.3 Definicao de Pronto (DoD)
Uma entrega sera considerada concluida quando:
1. Atender ao criterio de aceite funcional.
2. Estiver integrada com a API de homologacao.
3. Possuir validacoes e feedback visual de erro/sucesso.
4. Estiver responsiva.
5. Passar nos testes previstos para a feature.

## 9. Cronograma Executivo (10 Semanas)
### Semana 1 - Fundacao
- Refinamento final de requisitos front-end.
- Definicao de arquitetura e padroes de codigo.
- Setup do projeto Vue + TypeScript.
- Definicao inicial do design system (tokens e componentes base).

### Semana 2 - Autenticacao
- Tela de login.
- Recuperacao de senha.
- Persistencia de sessao.
- Rotas protegidas e guardas de autenticacao.

### Semana 3 - Feed Publico
- Estrutura de listagem de posts.
- Cards de pesquisa.
- Paginacao inicial.
- Estados de carregamento e vazio.

### Semana 4 - Busca e Filtros
- Filtro por area.
- Busca textual por titulo/resumo.
- Filtro por aluno/orientador.
- Reset de filtros e ordenacao basica.

### Semana 5 - Detalhes da Pesquisa
- Tela de detalhes.
- Exibicao de metadados.
- Acao de download de PDF.
- Tratamento de erro para arquivo indisponivel.

### Semana 6 - Criacao de Post
- Formulario completo de postagem.
- Validacao de campos obrigatorios.
- Upload de PDF e imagem com barra de progresso.
- Mensagens de confirmacao e erro.

### Semana 7 - Area do Usuario
- Tela de meus posts.
- Edicao basica de publicacao.
- Acao de arquivar/despublicar (conforme API).

### Semana 8 - Qualidade de UX
- Ajustes de acessibilidade.
- Ajustes de responsividade fina.
- Uniformizacao visual e de microinteracoes.

### Semana 9 - Testes e Estabilizacao
- Testes unitarios de componentes criticos.
- Testes E2E dos fluxos principais.
- Correcao de bugs e melhoria de robustez.

### Semana 10 - Fechamento do TCC
- Consolidacao de resultados.
- Documentacao tecnica.
- Preparacao da demonstracao final.
- Geracao de evidencias para banca.

## 10. Backlog Inicial Priorizado
1. Login institucional funcional.
2. Feed publico com filtros minimos.
3. Pagina de detalhes com download.
4. Formulario de postagem com upload.
5. Tratamento de erros da API.
6. Responsividade completa.
7. Testes dos fluxos criticos.

## 11. Criterios de Aceitacao por Macroentrega
### 11.1 Autenticacao
- Usuario com credenciais validas acessa area protegida.
- Usuario invalido recebe mensagem clara sem quebra de fluxo.

### 11.2 Feed e Busca
- Visitante visualiza lista de pesquisas sem autenticacao.
- Filtros retornam resultados coerentes e combinaveis.

### 11.3 Publicacao
- Usuario autenticado publica post com campos obrigatorios.
- Upload respeita tipo/tamanho permitidos.

### 11.4 Responsividade e Acessibilidade
- Interface opera corretamente em larguras mobile e desktop.
- Elementos interativos sao acessiveis por teclado.

## 12. Matriz de Riscos (Recorte Front-end)
1. Risco: desalinhamento entre contrato de API e telas.
- Probabilidade: media.
- Impacto: alto.
- Mitigacao: definir contratos antecipadamente e usar mocks versionados.

2. Risco: retrabalho por mudanca de requisito durante implementacao.
- Probabilidade: media.
- Impacto: medio.
- Mitigacao: refinamento semanal e controle formal de mudancas.

3. Risco: instabilidade de prazo por aculo de tarefas em poucos membros.
- Probabilidade: alta.
- Impacto: medio.
- Mitigacao: fatiar historias pequenas e redistribuir backlog por sprint.

4. Risco: problemas de usabilidade na primeira versao.
- Probabilidade: media.
- Impacto: medio.
- Mitigacao: validacoes rapidas com usuarios e ajustes iterativos.

5. Risco: baixo desempenho em listas extensas.
- Probabilidade: baixa.
- Impacto: medio.
- Mitigacao: paginacao, debounce na busca e cache de consultas.

## 13. Governanca, Monitoramento e Indicadores
### 13.1 Cerimonias
- Reuniao semanal de planejamento (30 minutos).
- Check-in tecnico rapido (15 minutos) em dias de desenvolvimento.
- Revisao de sprint com demonstracao.

### 13.2 Indicadores
1. Progresso: percentual de historias concluidas por sprint.
2. Qualidade: quantidade de bugs por severidade.
3. Prazo: variacao entre planejado e realizado.
4. Estabilidade: taxa de sucesso dos testes E2E.
5. Produto: tempo medio para concluir publicacao de um post.

### 13.3 Artefatos de Controle
- Quadro Kanban.
- Registro de riscos.
- Burndown semanal.
- Relatorio de sprint.

## 14. Estrutura Sugerida para o Capitulo do TCC
1. Introducao e contextualizacao.
2. Problema de pesquisa e justificativa.
3. Objetivos geral e especificos.
4. Referencial tecnico (SPA, UX, acessibilidade, APIs REST).
5. Metodologia de desenvolvimento.
6. Plano executivo (este documento).
7. Implementacao e resultados.
8. Analise critica, limitacoes e trabalhos futuros.

## 15. Encaminhamentos Imediatos
1. Validar este plano com orientador e ajustar prioridades.
2. Congelar escopo do MVP do front-end.
3. Definir contratos finais da API para autenticacao, feed, detalhes e publicacao.
4. Iniciar sprint 1 com setup tecnico e design system base.

## 16. Conclusao
O presente plano executivo transforma o projeto academico original em uma rota objetiva de implementacao para TCC, com foco no front-end do sistema. A estrategia proposta reduz riscos, organiza prioridades e garante rastreabilidade das entregas, mantendo alinhamento com os objetivos institucionais de divulgacao das pesquisas de extensao.
