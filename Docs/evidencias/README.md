# Indice de Evidencias - Heuristicas de Nielsen

Este diretorio reune registros visuais e resultados de verificacao usados como apoio para a avaliacao heuristica do IFF Pesquisas.

As evidencias nao substituem a analise do codigo, mas ajudam a demonstrar no TCC como as melhorias aparecem na interface.

## Matriz de rastreabilidade

| Evidencia | Fluxo/tela | Heuristicas relacionadas | Observacao |
|---|---|---|---|
| `01_home_desktop.png` | Pagina inicial desktop | H2, H4, H8, H10 | Apresenta linguagem institucional e estrutura visual principal |
| `02_home_mobile.png` | Pagina inicial mobile | H4, H8 | Evidencia responsividade |
| `03_feed_pesquisas.png` | Feed de pesquisas | H1, H2, H6, H8 | Mostra acervo, cards e estrutura de resultados |
| `04_filtros_ativos.png` | Busca e filtros | H1, H6, H7 | Demonstra filtros ativos e reconhecimento do estado atual |
| `05_detalhes_pesquisa.png` | Detalhes de pesquisa | H2, H6, H8 | Mostra informacoes academicas da publicacao |
| `06_login_erro.png` | Login com erro | H5, H9 | Evidencia validacao e mensagem de erro |
| `07_pos_login.png` | Estado autenticado | H1, H3, H4 | Demonstra mudanca de navegacao apos login |
| `08_criar_post.png` | Publicar pesquisa | H1, H5, H6, H9 | Evidencia formulario, campos e upload |
| `09_meus_posts.png` | Minhas publicacoes | H3, H4, H6 | Mostra gestao de publicacoes e acoes principais |
| `10_dark_mode.png` | Tema escuro | H7, H8 | Demonstra flexibilidade visual |
| `11_recuperar_senha.png` | Recuperacao de senha | H5, H9, H10 | Evidencia fluxo de ajuda para acesso |
| `12_resultado_testes.txt` | Resultado de testes anterior | H10 | Registro historico de validacao |
| `13_demo_fluxo.webm` | Fluxo principal gravado | H1, H3, H6, H7, H10 | Video de demonstracao para apresentacao academica |
| `page@*.webm` | Videos gerados por Playwright | H10 | Evidencias complementares de execucoes E2E |

## Decisao de escopo refletida nas evidencias

Nao ha evidencia de chat, mensagens diretas, comentarios, curtidas ou matchmaking automatico porque esses recursos estao fora do escopo da versao atual.

As evidencias de colaboracao devem ser interpretadas como validacao do fluxo estruturado de:

- solicitacao de colaboracao;
- cursos desejados;
- competencias necessarias;
- demonstracao de interesse;
- lista de interessados;
- gestao de status.

## Como usar no TCC

Recomenda-se citar este indice ao explicar a metodologia de validacao visual. Para cada heuristica, relacione pelo menos uma evidencia visual com a evidencia de codigo descrita em `Docs/HEURISTICAS_NIELSEN.md`.

## Manutencao

Ao adicionar novas telas ou fluxos:

1. Gere uma nova evidencia visual ou video curto.
2. Nomeie o arquivo de forma descritiva.
3. Inclua uma linha nesta matriz.
4. Relacione a evidencia com uma ou mais heuristicas.
5. Atualize o veredicto se a mudanca alterar o nivel de aderencia.
