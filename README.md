# 🚀 Personal Portfolio

Portfólio pessoal moderno desenvolvido com React 19, TypeScript e Tailwind CSS v4, com animações suaves, componentes acessíveis e design responsivo.

## ✨ Stack de Tecnologia

### Core
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server ultra-rápido

### Styling & Animation
- **Tailwind CSS v4** - Framework CSS utility-first
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
- **Next Themes** - Gerenciamento de tema dark/light mode

### Roteamento & Data
- **React Router DOM v7** - Roteamento para SPAs
- **TanStack React Query** - Gerenciamento de estado e cache de dados
- **date-fns** - Manipulação de datas com locale pt-BR

### APIs & Integração
- **GitHub API** - Integração com repositórios e dados do GitHub
- **Octokit** - Client para GitHub API

### Development
- **ESLint** - Análise estática e linting de código
- **TypeScript** - Type checking e desenvolvimento type-safe

## 🎨 Design System

### Componentes Principais

#### Seções de Conteúdo
- **Hero** - Apresentação inicial com animações e CTA
- **About** - Grid de skills e tecnologias com badges coloridos categorizados
- **Projects** - Galeria de repositórios GitHub com filtros por linguagem, stats e links
- **Certificates** - Cards em glassmorphism com informações de cursos e formações
- **Contact** - Formulário de contato com validação e notificações
- **GitHubActivity** - Widget de atividade recente do GitHub

#### Navegação & Tema
- **Navbar** - Menu responsivo com links âncora suave
- **NavLink** - Componente reutilizável para links de navegação
- **ThemeToggle** - Alternador entre dark/light mode com ícone animado

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
- Animações customizadas (float, fade, slide, scale)
- Sombras suaves e glow effects
- Transições smooth e bounce
- Componentes responsivos

## 🚀 Como Executar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build de Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── assets/              # Imagens, ícones e arquivos estáticos
├── components/
│   ├── Navbar.tsx           # Barra de navegação responsiva com logo e menu
│   ├── NavLink.tsx          # Link de navegação reutilizável com scroll suave
│   ├── Hero.tsx             # Seção hero inicial com apresentação e CTA
│   ├── About.tsx            # Grid de skills categorizados (frontend, backend, tools, etc)
│   ├── Projects.tsx         # Seção de projetos com integração GitHub API
│   ├── Certificates.tsx     # Cards em glassmorphism com certificados/formações
│   ├── Contact.tsx          # Formulário de contato com validação
│   ├── GitHubActivity.tsx   # Widget de atividade recente do GitHub
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
│   ├── use-github.ts        # Hook para integração com GitHub API (React Query)
│   └── use-mobile.tsx       # Hook para detecção de dispositivos móveis
├── lib/
│   └── utils.ts             # Funções utilitárias (cn para merge de classes)
├── pages/
│   ├── Index.tsx            # Página principal com todas as seções
│   └── NotFound.tsx         # Página 404 customizada
├── App.tsx                  # Componente raiz com providers e routing
├── App.css                  # Estilos específicos do App
├── index.css                # Estilos globais e CSS variables (HSL)
└── main.tsx                 # Entry point da aplicação
```

## ⚙️ Configuração

### Vite
- Path alias `@` apontando para `src/`
- Dev server na porta 8080
- Suporte a Hot Module Replacement (HMR)

### TypeScript
- Target: ES2020
- Modo estrito desativado para flexibilidade
- Path mapping configurado para aliases (`@/*` → `src/*`)
- JSX: react-jsx (React 19)
- Support para importação de extensões TypeScript

### Tailwind CSS
- Versão 4.1 com plugin Vite para otimização
- Integração completa com PostCSS e Autoprefixer
- Suporte a animações customizadas (`tailwindcss-animate`)
- Merge inteligente de classes com `tailwind-merge`

### ESLint
- Configuração flat com ESLint v9
- Suporte a React Hooks e React Refresh
- TypeScript plugin integrado para análise de código seguro

### Estrutura de Configuração TypeScript
- `tsconfig.json` - Configuração raiz com paths compartilhados
- `tsconfig.app.json` - Configuração específica da aplicação
- `tsconfig.node.json` - Configuração para ferramentas de build

## 📊 Status do Setup

✅ Vite + React 19 + TypeScript  
✅ Tailwind CSS v4.1  
✅ Componentes UI (Radix + Shadcn)  
✅ Tema dark/light (next-themes)  
✅ Toast notifications (Radix + Sonner)  
✅ Tooltips acessíveis  
✅ Animações (Framer Motion)  
✅ Ícones (Lucide React)  
✅ Roteamento (React Router v7)  
✅ Gerenciamento de dados (TanStack Query)  
✅ Linting e análise de código  
✅ **Integração com GitHub API** (repositórios, atividade)  
✅ **Seções completas** (Hero, About, Projects, Certificates, Contact)  
✅ **Layout glassmorphism** com cards estilizados  
✅ **Animações suaves** (Framer Motion) com hover effects  
✅ **Formulário de contato** com validação  
✅ **Responsividade** mobile-first em todos os componentes  

## 🎯 Próximos Passos Sugeridos

- [ ] Integrar formulário de contato com backend para receber emails (EmailJS, SendGrid, etc)
- [ ] Adicionar seção de footer com links sociais
- [ ] Implementar analytics (Google Analytics ou Plausible)
- [ ] Otimizar SEO (meta tags, sitemap.xml, robots.txt)
- [ ] Adicionar testes unitários (Vitest + React Testing Library)
- [ ] Adicionar testes E2E (Playwright ou Cypress)
- [ ] Melhorar performance (lazy loading de imagens, code splitting)
- [ ] Adicionar seção de blog/artigos com MDX
- [ ] Implementar scroll smooth entre seções
- [ ] Deploy em plataforma (Vercel, Netlify, etc)
- [ ] Adicionar suporte a múltiplos idiomas (i18n)
