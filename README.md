# 🚀 Personal Portfolio

Portfólio pessoal moderno desenvolvido com React 18, TypeScript e Tailwind CSS, com componentes acessíveis e design responsivo.

**Produção:** https://samialuvanicedev.vercel.app (Vercel)

## ✨ Stack de Tecnologia

### Core
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server ultra-rápido

### Styling
- **Tailwind CSS** - Framework CSS utility-first
- **Tailwind Merge** - Utilitário para merge de classes Tailwind
- **CLSX** - Utilitário para gerenciamento condicional de classes

### UI & Components
- **Radix UI** - Componentes primitivos acessíveis
  - `@radix-ui/react-accordion` - Accordion da seção Expertise
  - `@radix-ui/react-slot` - Primitivo de composição
- **Lucide React** - Ícones SVG limpos e consistentes

### Roteamento
- **React Router DOM v6** - Roteamento para SPAs
- **date-fns** - Manipulação de datas com locale pt-BR

### Development & Qualidade
- **ESLint** (flat config, `--max-warnings=0`) e **TypeScript** em modo `strict`
- **Vitest** - testes de unidade
- **Playwright + axe-core** - testes E2E e de acessibilidade contra o build
- **Lighthouse CI** - orçamento de acessibilidade, SEO, boas práticas e desempenho
- **Harness de agentes** - `.agents/` como fonte única para Claude, Codex, OpenCode e Cursor ([docs/harness.md](docs/harness.md))

## 🎨 Design System

### Componentes Principais

#### Seções de Conteúdo
A ordem na página é Hero, Projetos, Expertise, Experiência e Contato, seguida do rodapé. As seções
abaixo da dobra são carregadas sob demanda e o conteúdo fica em `src/content/portfolio.ts`.

- **Hero** - Apresentação inicial com retrato e CTA
- **Projects** - Projetos com filtro (todos, autorais, comerciais) em cards (`ProjectCard`)
- **Expertise** - Accordion (Radix) com vários itens abertos e prévia ilustrada (`ExpertisePreview`)
- **Experience** - Experiência profissional
- **Contact** - E-mail (`mailto:` com assunto pronto) e redes sociais
- **SectionTitle** / **AvailabilityBadge** - Título de seção e selo de disponibilidade

#### Navegação
- **Navbar** - Barra superior fixa a partir de 1024 px e barra inferior de quatro colunas abaixo disso; a seção ativa recebe `aria-current`
- **Footer** - Rodapé com links sociais, rápidos e informações de copyright

#### Componentes UI Reutilizáveis
O projeto inclui 25+ componentes Shadcn/UI baseados em Radix UI:
- Button, Input, Textarea, Card, Badge, Tooltip
- Dialog, Drawer, Sheet, Popover, Hover Card
- Avatar, Skeleton, Badge, Alert, Progress
- Tabs, Carousel, Accordion, Select, Checkbox, Radio
- E muitos outros...

### Padrões de Design
- **Responsividade** - Tailwind breakpoints (mobile-first)
- **Acessibilidade** - Radix UI primitivos acessíveis, labels, ARIA
- **Esquema de cores fixo por seção** - `:root` claro e `.surface-dark` em `src/index.css`, sem alternância de tema

### Hooks Customizados
- **useActiveSection()** - Indica a seção visível para marcar o link ativo da navegação (`src/hooks/use-active-section.ts`)
- **useToast()** - Hook para disparar notificações toast

### Tipografia
- **Sora** - Fonte principal (sans-serif)
- **Space Grotesk** - Fonte de display (títulos)

### Tokens de Cores (HSL)
- `--background` - Cor de fundo principal
- `--foreground` - Cor de texto principal
- `--primary` - Cor primária (laranja vibrante)
- `--primary-glow` - Variação com brilho
- `--accent` - Cor de destaque (magenta)
- `--tertiary` - Cor terciária (ciano)
- `--muted` - Cores neutras
- `--surface-dark` - Superfície escura aplicada por seção com `.surface-dark`

### Recursos de Design
- Sistema de cores HSL configurável
- Gradientes personalizados
- Imagens em WebP (`public/projects/`, `public/hero/portrait.webp`)
- Sombras suaves e glow effects
- Transições smooth e bounce
- Componentes responsivos

## 🚀 Como Executar

Requer Node 22.18+ (`.nvmrc`).

```bash
npm ci                 # instala dependências
npm run dev            # http://localhost:8080
```

| Script | O que faz |
|---|---|
| `npm run dev` | Vite com HMR |
| `npm run build` / `npm run preview` | Build de produção e preview local |
| `npm run lint` | ESLint sem avisos tolerados |
| `npm run typecheck` | TypeScript estrito para app e configs |
| `npm test` | Vitest |
| `npm run test:e2e` | Playwright + axe contra o build (instale antes: `npx playwright install chromium`) |
| `npm run lighthouse` | Lighthouse CI sobre `dist/` (rode `npm run build` antes) |
| `npm run check` | Todos os portões de `harness.yaml` |

## Docker (alternativa local/self-host)

A produção é a Vercel; o Docker é uma alternativa para rodar o site localmente ou em servidor próprio: o build é servido por Nginx, com fallback para as rotas do React.

### Subir o ambiente

Com o Docker Desktop em execução:

```bash
docker compose up --build
```

O portfólio ficará disponível em `http://localhost:8080`.

Para encerrar os serviços:

```bash
docker compose down
```

## 📁 Estrutura do Projeto

```
.agents/                 # Harness de agentes (fonte única; ver docs/harness.md)
e2e/                     # Testes Playwright + axe
docs/                    # Arquitetura, harness e aprendizados
specs/                   # Especificações numeradas (fluxo /spec → /verify)
public/
├── hero/portrait.webp   # Retrato do Hero (pré-carregado no index.html)
├── projects/            # Imagens dos projetos em WebP
└── ...                  # Arquivos públicos (robots, sitemap, certificados, etc.)
src/
├── components/
│   ├── Navbar.tsx           # Barra superior (≥ 1024 px) ou inferior de quatro colunas, com seção ativa
│   ├── Hero.tsx             # Seção hero inicial com apresentação e CTA
│   ├── AvailabilityBadge.tsx # Selo de disponibilidade
│   ├── SectionTitle.tsx     # Título padrão das seções
│   ├── Projects.tsx         # Seção de projetos com filtro
│   ├── ProjectCard.tsx      # Card de projeto
│   ├── Expertise.tsx        # Accordion de áreas de atuação
│   ├── ExpertisePreview.tsx # Prévia ilustrada de cada área
│   ├── Experience.tsx       # Experiência profissional
│   ├── Contact.tsx          # Contato por e-mail e redes sociais
│   ├── Footer.tsx           # Rodapé com links sociais e rápidos
│   ├── ErrorBoundary.tsx    # Fallback para erros de renderização
│   └── ui/                  # 25+ Componentes UI reutilizáveis (Shadcn/Radix)
│       ├── button.tsx       # Botão estilizado com variantes
│       ├── input.tsx        # Input de formulário
│       ├── textarea.tsx     # Textarea para mensagens
│       ├── toast.tsx        # Sistema de notificações (Radix UI)
│       ├── toaster.tsx      # Container das notificações
│       ├── tooltip.tsx      # Tooltips acessíveis
│       ├── sonner.tsx       # Integração Sonner para toasts
│       ├── card.tsx         # Card base para layout
│       ├── badge.tsx        # Badge para tags/labels
│       ├── avatar.tsx       # Avatar para imagens de perfil
│       ├── separator.tsx    # Separador visual
│       └── [outros...].tsx  # Accordion, Alert, Dialog, Drawer, Select, etc.
├── content/
│   └── portfolio.ts         # Conteúdo da página (projetos, expertise, experiência, links, navegação)
├── hooks/
│   ├── use-active-section.ts # Seção visível para a navegação
│   └── use-toast.ts         # Hook para disparo de notificações
├── lib/
│   ├── active-section.ts    # Lógica pura da seção ativa
│   ├── contact.ts           # Monta o link mailto: do contato
│   ├── filter-projects.ts   # Filtro de projetos por categoria
│   └── utils.ts             # Funções utilitárias (cn para merge de classes)
├── pages/
│   ├── Index.tsx            # Página principal; seções abaixo da dobra sob demanda
│   └── NotFound.tsx         # Página 404 customizada
├── App.tsx                  # Componente raiz com ErrorBoundary e routing
├── App.css                  # Estilos específicos do App
├── index.css                # Estilos globais e CSS variables (HSL)
└── main.tsx                 # Entry point da aplicação
```

## ⚙️ Configuração

### Contato
Não há backend: a seção de contato usa um link `mailto:` montado por `src/lib/contact.ts` (testado com Vitest). O projeto não precisa de variáveis de ambiente.

#### Deployment na Vercel

1) **Conectar GitHub:**
   - Ir para [vercel.com](https://vercel.com)
   - Conectar repositório

2) **Deploy automático:**
   - Cada PR ganha um preview; cada merge em `main` vai para produção
   - O GitHub Actions (`.github/workflows/ci.yml`) só valida; quem publica é a Vercel
   - `vercel.json` define o fallback da SPA e cabeçalhos de segurança/cache

### Vite
- Path alias `@` apontando para `src/`
- Dev server na porta 8080
- Suporte a Hot Module Replacement (HMR)

### TypeScript
- Modo `strict` em todos os projetos (`tsconfig.app.json`, `tsconfig.node.json`)
- Path mapping configurado para aliases (`@/*` → `src/*`)
- JSX: react-jsx (React 18)

### Tailwind CSS
- Versão 3.4 via PostCSS e Autoprefixer
- Suporte a animações customizadas (`tailwindcss-animate`)
- Merge inteligente de classes com `tailwind-merge`

### ESLint
- Configuração flat com ESLint v9
- Suporte a React Hooks e React Refresh
- TypeScript plugin integrado; zero avisos tolerados (`--max-warnings=0`)

### Estrutura de Configuração TypeScript
- `tsconfig.json` - Configuração raiz com paths compartilhados
- `tsconfig.app.json` - Configuração específica da aplicação
- `tsconfig.node.json` - Configuração para ferramentas de build e testes

## ⚡ Otimizações de Performance

### Code Splitting
O projeto usa `React.lazy()` para carregar sob demanda as seções abaixo da dobra:
**Projects**, **Expertise**, **Experience** e **Contact**.

Cada seção tem um `Suspense` com um espaço reservado de altura mínima, para a página não pular
enquanto o chunk carrega.

### Imagens e fontes
- Retrato do Hero em `public/hero/portrait.webp`, pré-carregado no `index.html` (imagem do LCP)
- Imagens dos projetos em WebP, preguiçosas
- Fontes do Google com `preload` e troca no `onload`, sem bloquear a renderização

**Arquivo:** [src/pages/Index.tsx](src/pages/Index.tsx)

## 📊 Status do Setup

### Frontend
✅ Vite + React 18 + TypeScript (strict)  
✅ Tailwind CSS  
✅ Componentes UI (Radix + Shadcn)  
✅ Ícones (Lucide React)  
✅ Roteamento (React Router v6)  
✅ Linting e análise de código  
✅ **Code splitting** (React.lazy + Suspense)  

### Funcionalidades
✅ **Seções completas** (Hero, Projects, Expertise, Experience, Contact, Footer)  
✅ **Navegação com seção ativa** (`aria-current`)  
✅ **Contato** por e-mail (`mailto:` com assunto pronto)  
✅ **Footer com links sociais** (GitHub, LinkedIn, Email)  
✅ **Responsividade** mobile-first em todos os componentes  
✅ **Scroll smooth** entre seções  

### Deploy
✅ Vercel (preview por PR, produção em `main`)
✅ **Deploy em produção** (https://samialuvanicedev.vercel.app)
✅ Docker + Nginx como alternativa local

### Performance
✅ **Code splitting** - Seções abaixo da dobra (Projects, Expertise, Experience, Contact) carregam sob demanda
✅ **Espaço reservado** - Altura mínima durante o carregamento das seções
✅ **Vite otimizado** - Build ultra-rápido com chunking automático  

## 🎯 Próximos Passos Sugeridos

- [ ] Implementar analytics (Google Analytics ou Plausible)
- [x] Otimizar SEO (canonical, Open Graph, sitemap.xml, robots.txt)
- [x] Adicionar testes unitários (Vitest)
- [x] Adicionar testes E2E (Playwright + axe)
- [ ] Imagem Open Graph (`og:image`) para prévias em redes sociais
- [ ] Adicionar suporte a múltiplos idiomas (i18n)
- [x] Melhorar tratamento de erros no backend
- [x] Adicionar validação mais robusta no servidor
- [ ] Implementar PWA (Progressive Web App) com Service Workers
