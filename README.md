# 🚀 Personal Portfolio

Portfólio pessoal moderno desenvolvido com React 18, TypeScript e Tailwind CSS, com animações suaves, componentes acessíveis e design responsivo.

**Produção:** https://samialuvanicedev.vercel.app (Vercel)

## ✨ Stack de Tecnologia

### Core
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server ultra-rápido

### Styling & Animation
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Biblioteca de animações para React
- **Tailwind Merge** - Utilitário para merge de classes Tailwind
- **CLSX** - Utilitário para gerenciamento condicional de classes

### UI & Components
- **Radix UI** - Componentes primitivos acessíveis
  - `@radix-ui/react-toast` - Sistema de notificações nativo
  - `@radix-ui/react-tooltip` - Tooltips acessíveis
  - `@radix-ui/react-slot` - Primitivo de composição
- **Sonner** - Toast notifications com animações
- **Lucide React** - Ícones SVG limpos e consistentes
- **React Icons** - Logos de tecnologias e ferramentas no About
- **Next Themes** - Gerenciamento de tema dark/light mode

### Roteamento & Data
- **React Router DOM v6** - Roteamento para SPAs
- **TanStack React Query** - Gerenciamento de estado e cache de dados
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
- **Hero** - Apresentação inicial com animações e CTA
- **About** - Grid de skills e tecnologias com badges coloridos, logos e categorias
- **Projects** - Galeria de repositórios GitHub com filtros por linguagem, stats e links
- **Certificates** - Cards em glassmorphism com informações de cursos e formações
- **Contact** - E-mail (`mailto:` com assunto pronto) e redes sociais

#### Navegação & Tema
- **Navbar** - Menu responsivo com links âncora suave
- **NavLink** - Componente reutilizável para links de navegação
- **ThemeToggle** - Alternador entre dark/light mode com ícone animado
- **Footer** - Rodapé com links sociais, rápidos e informações de copyright

#### Componentes UI Reutilizáveis
O projeto inclui 25+ componentes Shadcn/UI baseados em Radix UI:
- Button, Input, Textarea, Card, Badge, Tooltip
- Dialog, Drawer, Sheet, Popover, Hover Card
- Avatar, Skeleton, Badge, Alert, Progress
- Tabs, Carousel, Accordion, Select, Checkbox, Radio
- E muitos outros...

### Padrões de Design
- **Layout glassmorphism** - Cards com efeito vidro translúcido
- **Animações Framer Motion** - Fade, scale, y-offset, rotate, hover effects
- **Responsividade** - Tailwind breakpoints (mobile-first)
- **Acessibilidade** - Radix UI primitivos acessíveis, labels, ARIA
- **Temas** - Dark/light mode com next-themes

### Hooks Customizados
- **useToast()** - Hook para disparar notificações toast
- **useTheme()** - Hook para gerenciar tema dark/light (next-themes)
- **useGitHubRepos()** - Hook para buscar repositórios com React Query, filtros por linguagem
- **useIsMobile()** - Hook para detecção de dispositivos móveis com media queries

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
- Suporte completo para dark mode via `next-themes`

### Recursos de Design
- Sistema de cores HSL configurável
- Gradientes personalizados
- Efeitos glassmorphism
- Logos de tecnologias no About (`react-icons` + SVGs customizados)
- Animações customizadas (float, fade, slide, scale)
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
├── icons/
│   ├── manychat.svg     # Logo customizada do ManyChat usada no About
│   └── vscode.svg       # Logo customizada do VS Code usada no About
└── ...                  # Arquivos públicos (robots, certificados, projetos, etc.)
src/
├── assets/              # Imagens, ícones e arquivos estáticos
├── components/
│   ├── Navbar.tsx           # Barra de navegação responsiva com logo e menu
│   ├── NavLink.tsx          # Link de navegação reutilizável com scroll suave
│   ├── Hero.tsx             # Seção hero inicial com apresentação e CTA
│   ├── About.tsx            # Grid de skills categorizados (frontend, backend, tools, etc)
│   ├── Projects.tsx         # Seção de projetos
│   ├── Certificates.tsx     # Cards em glassmorphism com certificados/formações
│   ├── Contact.tsx          # Contato por e-mail e redes sociais
│   ├── Footer.tsx           # Rodapé com links sociais e rápidos
│   ├── ThemeToggle.tsx      # Alternador entre dark/light mode
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
├── hooks/
│   ├── use-toast.ts         # Hook para disparo de notificações
│   └── use-mobile.tsx       # Hook para detecção de dispositivos móveis
├── lib/
│   ├── utils.ts             # Funções utilitárias (cn para merge de classes)
├── pages/
│   ├── Index.tsx            # Página principal com todas as seções
│   └── NotFound.tsx         # Página 404 customizada
├── App.tsx                  # Componente raiz com providers e routing
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
O projeto usa `React.lazy()` para carregar componentes pesados sob demanda:
- **Certificates** - Carregado apenas quando próximo de ser visualizado
- **Projects** - Carregado sob demanda
- **Contact** - Componente carregado sob demanda

Cada seção tem um `Suspense` com fallback de skeleton para melhor UX.

**Arquivo:** [src/pages/Index.tsx](src/pages/Index.tsx)

## 📊 Status do Setup

### Frontend
✅ Vite + React 18 + TypeScript (strict)  
✅ Tailwind CSS  
✅ Componentes UI (Radix + Shadcn)  
✅ Tema dark/light (next-themes)  
✅ Toast notifications (Radix + Sonner)  
✅ Tooltips acessíveis  
✅ Animações (Framer Motion)  
✅ Ícones (Lucide React)  
✅ Logos de tecnologias (React Icons + SVG custom)  
✅ Roteamento (React Router v6)  
✅ Gerenciamento de dados (TanStack Query)  
✅ Linting e análise de código  
✅ **Code splitting** (React.lazy + Suspense)  

### Funcionalidades
✅ **Seções completas** (Hero, About, Projects, Certificates, Contact, Footer)  
✅ **Layout glassmorphism** com cards estilizados  
✅ **Animações suaves** (Framer Motion) com hover effects  
✅ **Contato** por e-mail (`mailto:` com assunto pronto)  
✅ **Footer com links sociais** (GitHub, LinkedIn, Email)  
✅ **Responsividade** mobile-first em todos os componentes  
✅ **Scroll smooth** entre seções  

### Deploy
✅ Vercel (preview por PR, produção em `main`)
✅ **Deploy em produção** (https://samialuvanicedev.vercel.app)
✅ Docker + Nginx como alternativa local

### Performance
✅ **Code splitting** - Componentes pesados (Certificates, Projects, Contact) carregam sob demanda
✅ **Loading skeletons** - Fallback visual durante carregamento de componentes
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
