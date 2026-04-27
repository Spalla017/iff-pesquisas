# IFF Pesquisas 🎓

Plataforma acadêmica para divulgação de pesquisas e projetos de extensão do **Instituto Federal Fluminense — Campus Itaperuna**.

> Projeto de TCC — Curso de Sistemas de Informação

---

## ✨ Funcionalidades

- 🔍 **Busca e Filtros** — pesquisa textual por título, resumo e palavras-chave; filtro por área de conhecimento, autor e orientador
- 📄 **Upload de PDF** — publicação com arquivo PDF e imagem de capa via drag-and-drop
- 🏷️ **Palavras-chave** — categorização com tags dinâmicas
- 📄 **Paginação** — navegação por páginas no feed de pesquisas
- 🔐 **Autenticação** — login institucional com JWT/Sanctum
- 📱 **Responsivo** — menu hamburger e layout adaptável para mobile

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Vue 3 + TypeScript + Vite |
| Estado | Pinia |
| Roteamento | Vue Router 4 |
| HTTP | Axios |
| Validação | VeeValidate + Zod |
| Estilos | Vanilla CSS (Design System próprio) |
| Backend (planejado) | Laravel 11 + Sanctum |
| Banco de Dados | MySQL 8.0 |

---

## 📁 Estrutura

```
Projeto Academico/
├── frontend/              # Aplicação Vue 3
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── stores/        # Estado global (Pinia)
│   │   ├── services/      # Camada de API (Axios)
│   │   ├── types/         # TypeScript interfaces
│   │   ├── data/          # Mock data para desenvolvimento
│   │   └── styles/        # Design system global
│   └── ...
└── backend/               # API Laravel (em desenvolvimento)
```

---

## 🚀 Rodando o Projeto

### Frontend

```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5173
```

### Backend (em breve)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
# API: http://localhost:8000/api
```

---

## 🔗 API Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Login institucional |
| GET | `/api/pesquisas` | ❌ | Listar pesquisas com filtros |
| GET | `/api/pesquisas/{id}` | ❌ | Detalhe de pesquisa |
| POST | `/api/pesquisas` | ✅ | Criar pesquisa + upload |
| PUT | `/api/pesquisas/{id}` | ✅ | Editar pesquisa |
| DELETE | `/api/pesquisas/{id}` | ✅ | Excluir pesquisa |
| GET | `/api/pesquisas/minhas` | ✅ | Pesquisas do usuário logado |

---

## 📸 Screenshots

> Adicionar screenshots após conclusão do projeto.

---

## 👤 Autor

**Vinícius Spalla Silva**  
Orientador: Prof. Luiz Cláudio  
Instituto Federal Fluminense — Campus Itaperuna  
Sistemas de Informação · 2026
