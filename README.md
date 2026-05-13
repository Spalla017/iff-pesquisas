# IFF Pesquisas

Plataforma academica para divulgacao de pesquisas, projetos de extensao e TCCs do **Instituto Federal Fluminense - Campus Itaperuna**.

> Projeto de TCC - Curso de Sistemas de Informacao

## Funcionalidades e entregas recentes

O front-end possui melhorias de usabilidade aplicadas com base nas Heuristicas de Nielsen e foi classificado como **Aprovado com ressalvas** na avaliacao documentada em `Docs/HEURISTICAS_NIELSEN.md`.

Principais recursos:

- **Busca e filtros avancados:** pesquisa textual por titulo, resumo e palavras-chave, com filtros por area, autor e orientador.
- **Autenticacao em modo de desenvolvimento:** login, recuperacao de senha e gestao de sessao preparados para integracao real.
- **Publicacao de pesquisas:** criacao e edicao com PDF, imagem de capa, palavras-chave e orientador.
- **Gestao de publicacoes:** area "Minhas publicacoes", edicao, exclusao e publicacao/despublicacao.
- **Colaboracao interdisciplinar:** solicitacoes de colaboracao entre cursos, competencias necessarias, demonstracao de interesse e lista de interessados.
- **Feedback ao usuario:** toasts, estados de carregamento, estados vazios e validacoes em portugues.
- **Documentacao e evidencias:** guia do usuario, avaliacao Nielsen, backlog e evidencias visuais para uso no TCC.

## Decisao de escopo

Chat, mensagens diretas entre usuarios, comentarios, curtidas e matchmaking automatico estao fora do escopo da versao atual.

A colaboracao nesta versao ocorre por meio de:

- criacao de solicitacao de colaboracao;
- indicacao de cursos desejados;
- indicacao de competencias necessarias;
- demonstracao de interesse;
- lista de interessados;
- gestao do status da solicitacao.

## Documentacao do projeto

Toda a documentacao detalhada fica armazenada na pasta `Docs/`.

- [Decisoes Tecnicas](./Docs/DECISOES_TECNICAS.md)
- [Avaliacao Heuristica de Nielsen](./Docs/HEURISTICAS_NIELSEN.md)
- [Backlog de Usabilidade Nielsen](./Docs/BACKLOG_USABILIDADE_NIELSEN.md)
- [Guia do Usuario](./Docs/GUIA_USUARIO.md)
- [Design System de Cores](./Docs/DESIGN_SYSTEM_CORES.md)
- [Relatorio de Testes e Implementacao](./Docs/IMPLEMENTACAO_TEST_REPORT.md)
- [Evidencias Visuais](./Docs/evidencias/)
- [Indice de Evidencias Nielsen](./Docs/evidencias/README.md)
- [Projeto Base - PDF original](./Docs/Projeto%20Luiz%20Claudio%20(Final).pdf)

## Stack tecnologica

| Camada | Tecnologia |
|---|---|
| Frontend | Vue 3 + TypeScript + Vite |
| Estado | Pinia |
| Roteamento | Vue Router |
| HTTP | Axios com interceptors e modo mock-first |
| Validacao | Zod |
| Testes unitarios | Vitest + Vue Test Utils |
| Testes E2E | Playwright |
| Estilos | CSS com design tokens |

## Rodando o projeto localmente

### Pre-requisitos

- Node.js 18+
- NPM

### Instalacao e execucao

```bash
git clone https://github.com/Spalla017/iff-pesquisas.git
cd iff-pesquisas/frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

### Testes

```bash
npm run build
npm run test:run
npm run e2e
```

## Autor

**Vinicius Spalla Silva**  
Instituto Federal Fluminense - Campus Itaperuna  
Sistemas de Informacao - 2026
