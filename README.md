<div align="center">

# 🎬 Movie Atlas — TMDb Explorer

**Explore, descubra e salve seus filmes favoritos.**  
Aplicação web construída com React consumindo a API pública do [The Movie Database (TMDb)](https://www.themoviedb.org/).

<br/>

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-6.24-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=for-the-badge)](https://axios-http.com/)
[![Deploy](https://img.shields.io/badge/Deploy-Online-22c55e?style=for-the-badge&logo=vercel)](https://movie-atlas-api.vercel.app)

<br/>

[🌐 Acessar aplicação](https://movie-atlas-api.vercel.app) &nbsp;·&nbsp;
[🐛 Reportar bug](https://github.com/RenanSPradoo/MOVIE-ATLAS-API/issues) &nbsp;·&nbsp;
[📖 TMDb API](https://developer.themoviedb.org/)

</div>

---

## 📸 Screenshots

| Home | Detalhe do Filme |
|:----:|:----------------:|
| ![Home](docs/home.png) | ![Detalhe](docs/detail.png) |

| Busca | Favoritos |
|:-----:|:---------:|
| ![Busca](docs/search.png) | ![Favoritos](docs/favorites.png) |

> 💡 Adicione capturas de tela reais na pasta `docs/` após o primeiro deploy.

---

## ✨ Funcionalidades

### 🏠 Página Inicial
- Três seções de destaque: **Tendências da Semana**, **Em Cartaz** e **Mais Bem Avaliados**
- Filtros combinados por gênero, ano de lançamento e nota mínima
- Paginação numerada com até 5 páginas visíveis e reticências (`…`)
- Skeleton loading animado (shimmer) durante o carregamento

### 🎥 Página de Detalhes
- Hero com efeito parallax no scroll e overlay gradiente
- Trailer em modal fullscreen (YouTube) — feche com `ESC`
- Elenco principal com fotos circulares
- Onde assistir no Brasil (streaming e aluguel)
- Filmes similares em carrossel horizontal
- Orçamento, bilheteria, diretor, produtora e mais

### 🔍 Busca & Navegação
- Busca em tempo real por título de filme
- Filtro por gênero via rotas dinâmicas (`/genre/:id`)
- Links internos entre todas as páginas

### ⭐ Outros Recursos
- Favoritos e Watchlist salvos no `localStorage`
- Botão **Compartilhar** — copia o link para a área de transferência
- Tema **claro / escuro** com persistência entre sessões
- Badges **DUB / HD** nos cards de filmes
- Layout **100% responsivo** — mobile first

---

## 🛠 Tecnologias

| Tecnologia | Versão | Finalidade |
|:-----------|:------:|:-----------|
| [React](https://react.dev/) | 18.3 | Biblioteca de UI declarativa |
| [Vite](https://vitejs.dev/) | 5.2 | Bundler e servidor de desenvolvimento |
| [React Router DOM](https://reactrouter.com/) | 6.24 | Roteamento client-side (SPA) |
| [Axios](https://axios-http.com/) | 1.6 | Requisições HTTP para a API |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Estilização utilitária com CSS variables |
| [TMDb API](https://developer.themoviedb.org/) | v3 | Dados de filmes, trailers e streamings |

---

## 🏗 Arquitetura da Aplicação

```
┌──────────────────────────────────────────────────────────────┐
│                         Navegador                            │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                    React App (Vite)                   │   │
│  │                                                       │   │
│  │  ┌──────────────┐      ┌───────────────────────────┐  │   │
│  │  │   Roteador   │      │     Context (Global)      │  │   │
│  │  │ React Router │      │     FavoritesContext      │  │   │
│  │  │              │      │  · favorites (❤️)          │  │   │
│  │  │  /           │      │  · watchlist (📋)          │  │   │
│  │  │  /movie/:id  │      │  · localStorage           │  │   │
│  │  │  /genre/:id  │      └───────────────────────────┘  │   │
│  │  │  /search     │                                     │   │
│  │  │  /favorites  │                                     │   │
│  │  └──────┬───────┘                                     │   │
│  │         │                                             │   │
│  │         ▼                                             │   │
│  │  ┌──────────────────────────────────────────────┐     │   │
│  │  │                   Pages                      │     │   │
│  │  │  Home · MovieDetail · GenrePage              │     │   │
│  │  │  SearchPage · FavoritesPage                  │     │   │
│  │  └──────────────────┬───────────────────────────┘     │   │
│  │                     │                                 │   │
│  │          ┌──────────┴──────────┐                      │   │
│  │          ▼                     ▼                      │   │
│  │  ┌──────────────┐    ┌──────────────────────┐         │   │
│  │  │  Components  │    │        Hooks         │         │   │
│  │  │              │    │                      │         │   │
│  │  │  Navbar      │    │  useMovies           │         │   │
│  │  │  MovieCard   │    │  · fetching genérico │         │   │
│  │  │  FilterBar   │    │  · loading / error   │         │   │
│  │  │  Pagination  │    │                      │         │   │
│  │  │  SkeletonCard│    │  useGenres           │         │   │
│  │  │  Footer      │    │  · lista de gêneros  │         │   │
│  │  │  ErrorAlert  │    │                      │         │   │
│  │  └──────────────┘    │  useTheme            │         │   │
│  │                      │  · claro / escuro    │         │   │
│  │                      └──────────┬───────────┘         │   │
│  │                                 │                     │   │
│  │                                 ▼                     │   │
│  │                      ┌──────────────────────┐         │   │
│  │                      │      Services        │         │   │
│  │                      │   tmdbAPI (Axios)    │         │   │
│  │                      │   · baseURL          │         │   │
│  │                      │   · api_key + lang   │         │   │
│  │                      └──────────┬───────────┘         │   │
│  └─────────────────────────────────┼─────────────────────┘   │
└────────────────────────────────────┼────────────────────────-─┘
                                     │ HTTPS / REST
                                     ▼
                       ┌─────────────────────────┐
                       │      TMDb API v3         │
                       │  api.themoviedb.org/3    │
                       │                         │
                       │  /trending/movie/week    │
                       │  /movie/now_playing      │
                       │  /movie/top_rated        │
                       │  /movie/{id}             │
                       │    ?append=credits,      │
                       │           videos         │
                       │  /movie/{id}/similar     │
                       │  /movie/{id}/watch/      │
                       │         providers        │
                       │  /discover/movie         │
                       │  /search/movie           │
                       │  /genre/movie/list       │
                       └─────────────────────────┘
```

### 🔄 Fluxo de Dados

```
Usuário interage
      │
      ▼
   Página (Page)
      │  chama
      ▼
   Hook useMovies(apiFn)
      │  executa
      ▼
   Service tmdbAPI.método()
      │  faz request via
      ▼
   Axios (instância configurada)
      │  GET
      ▼
   TMDb API  ──────────────► resposta JSON
      ◄──────────────────────
      │
      ▼
   Hook atualiza estado { data, loading, error }
      │
      ▼
   Página renderiza componentes
```

---

## 📁 Estrutura de Pastas

```
tmdb-movies/
├── public/
├── src/
│   ├── assets/                  # Imagens e ícones estáticos
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ErrorAlert.jsx       # Banner de erro
│   │   ├── FilterBar.jsx        # Filtros: gênero, ano, nota mínima
│   │   ├── Footer.jsx           # Rodapé com atribuição TMDb
│   │   ├── Layout.jsx           # Wrapper com Navbar + Footer
│   │   ├── Loader.jsx           # Spinner de carregamento
│   │   ├── MovieCard.jsx        # Card: poster, badges, rating, favorito
│   │   ├── Navbar.jsx           # Barra de navegação com busca e gêneros
│   │   ├── Pagination.jsx       # Paginação numérica (máx. 5 botões)
│   │   └── SkeletonCard.jsx     # Placeholder animado (shimmer)
│   ├── constants/
│   │   └── tmdb.js              # Tamanhos de imagem, labels de gênero, helpers
│   ├── context/
│   │   └── FavoritesContext.jsx # Estado global: favoritos e watchlist
│   ├── hooks/
│   │   ├── useGenres.js         # Busca e cacheia lista de gêneros
│   │   ├── useMovies.js         # Hook genérico de fetch com estado
│   │   └── useTheme.js          # Controle de tema claro/escuro
│   ├── pages/
│   │   ├── FavoritesPage.jsx    # Lista de filmes favoritados
│   │   ├── GenrePage.jsx        # Filmes filtrados por gênero
│   │   ├── Home.jsx             # Página inicial com 3 seções + filtros
│   │   ├── MovieDetail.jsx      # Detalhe: hero, trailer, elenco, streaming
│   │   └── SearchPage.jsx       # Resultados de busca por título
│   ├── services/
│   │   └── api.js               # Instância Axios + todos os endpoints TMDb
│   ├── utils/
│   │   └── media.js             # Helpers: URL de imagem, formatação de ano
│   ├── App.jsx                  # Roteador + providers globais
│   ├── index.css                # Tokens CSS, tema escuro, animação skeleton
│   └── main.jsx                 # Entry point + prevenção de flash de tema
├── .env                         # Variáveis de ambiente (não commitar)
├── .env.example                 # Modelo para configuração local
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vercel.json                  # Rewrite para roteamento SPA na Vercel
└── vite.config.js
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) **v18 ou superior**
- [npm](https://www.npmjs.com/) **v9 ou superior**
- Chave de API gratuita do [TMDb](https://www.themoviedb.org/settings/api)

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/RenanSPradoo/MOVIE-ATLAS-API.git
cd MOVIE-ATLAS-API
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Abra o arquivo `.env` e adicione sua chave de API:

```env
VITE_TMDB_API_KEY=sua_chave_aqui
```

> 🔑 Obtenha sua chave gratuita em: https://www.themoviedb.org/settings/api

**4. Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse **[http://localhost:5173](http://localhost:5173)** no navegador.

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|:--------|:----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot reload |
| `npm run build` | Gera o build de produção na pasta `/dist` |
| `npm run preview` | Visualiza o build de produção localmente |

---

## 🌐 Deploy

### Vercel *(recomendado)*

1. Faça push do projeto para o repositório no GitHub
2. Acesse [vercel.com](https://vercel.com/) e importe o repositório `RenanSPradoo/MOVIE-ATLAS-API`
3. Em **Settings → Environment Variables**, adicione:

   | Nome | Valor |
   |:-----|:------|
   | `VITE_TMDB_API_KEY` | `sua_chave_aqui` |

4. Clique em **Deploy** ✅

> O arquivo `vercel.json` já está configurado para roteamento SPA — todas as rotas redirecionam corretamente para `index.html`.

**🔗 URL de produção:** [https://movie-atlas-api.vercel.app](https://movie-atlas-api.vercel.app)

---

## 👤 Autor

<table>
  <tr>
    <td align="center">
      <b>Renan Silva Prado</b><br/>
      <a href="https://github.com/RenanSPradoo">@RenanSPradoo</a>
    </td>
  </tr>
</table>

---

<div align="center">

<img
  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb20f684b5cb4736e21b87d91b8e93952.svg"
  width="180"
  alt="TMDb Logo"
/>

<sub>Este produto usa a API do TMDB mas não é endossado ou certificado pelo TMDB.</sub>

</div>
