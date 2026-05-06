# IFF Pesquisas 🎓

Plataforma acadêmica para divulgação de pesquisas e projetos de extensão do **Instituto Federal Fluminense — Campus Itaperuna**.

> **Projeto de TCC — Curso de Sistemas de Informação**

[![Vitest](https://img.shields.io/badge/Vitest-Test_Unitário-729B1B?logo=vitest&logoColor=white)](#)
[![Playwright](https://img.shields.io/badge/Playwright-Test_E2E-2EAD33?logo=playwright&logoColor=white)](#)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js&logoColor=white)](#)

---

## ✨ Funcionalidades e Entregas Recentes

O frontend atingiu **100% de conformidade** com os requisitos acadêmicos, incluindo:

- 🔍 **Busca e Filtros Avançados** — pesquisa textual por título, resumo e palavras-chave; filtro por área de conhecimento.
- 🔐 **Autenticação Simulada Completa** — fluxo de login, recuperação de senha e gestão de sessão com JWT mockado.
- 📱 **UI/UX e Responsividade** — design system customizado, dark mode e layout responsivo.
- 🛠️ **Garantia de Qualidade** — testes unitários (Vitest), testes E2E (Playwright) e validação estrita de formulários com Zod.
- 📣 **Feedback ao Usuário** — sistema de notificações Toast customizado.
- 📄 **Gestão de Posts** — criação com upload de PDF/Capa via drag-and-drop, alteração de status (Público/Privado) e listagem de "Meus Posts".

---

## 📚 Documentação do Projeto

Toda a documentação detalhada fica armazenada na pasta `Docs/`. Acesse os documentos principais:

- [📄 Plano Executivo e Decisões Técnicas](./Docs/DECISOES_TECNICAS.md)
- [✅ Relatório de Testes e Implementação](./Docs/IMPLEMENTACAO_TEST_REPORT.md)
- [📸 Evidências Visuais (Screenshots)](./Docs/evidencias/)
- [📖 Projeto Base (PDF original)](./Docs/Projeto%20Luiz%20Claudio%20(Final).pdf)

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | Vue 3 + TypeScript + Vite |
| Estado | Pinia |
| Roteamento | Vue Router 4 |
| HTTP | Axios (com interceptors e mock) |
| Validação | VeeValidate + Zod |
| Testes Unitários | Vitest + Vue Test Utils |
| Testes E2E | Playwright |
| Estilos | Vanilla CSS (Design System próprio) |

---

## 🚀 Rodando o Projeto Localmente

### Pré-requisitos
- Node.js (v18+)
- NPM ou Yarn

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/Spalla017/iff-pesquisas.git

# 2. Acesse a pasta do frontend
cd iff-pesquisas/frontend

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:5173
```

### Rodando os Testes

```bash
# Testes Unitários (Vitest)
npm run test:unit

# Testes End-to-End (Playwright)
npm run test:e2e

# Testes E2E com interface gráfica
npm run test:e2e:ui
```

---

## 👤 Autor

**Vinícius Spalla Silva**  
Orientador: Prof. Luiz Cláudio  
Instituto Federal Fluminense — Campus Itaperuna  
Sistemas de Informação · 2026
