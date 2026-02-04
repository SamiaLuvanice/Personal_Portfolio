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
- Animações customizadas (float, fade, slide, scale)
- Sombras suaves e glow effects
- Transições smooth e bounce
- Componentes responsivos

## 🚀 Como Executar

### Instalação
```bash
npm install
```

### Desenvolvimento (Frontend)
```bash
npm run dev
```

Frontend roda na porta 5173. Para testar `/api/*` localmente, use `vercel dev`.

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
api/
└── contact.ts           # Serverless function (Vercel)
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
│   ├── Footer.tsx           # Rodapé com links sociais e rápidos
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
│   ├── utils.ts             # Funções utilitárias (cn para merge de classes)
│   └── contactService.ts    # Serviço para envio de mensagens de contato
├── pages/
│   ├── Index.tsx            # Página principal com todas as seções
│   └── NotFound.tsx         # Página 404 customizada
├── App.tsx                  # Componente raiz com providers e routing
├── App.css                  # Estilos específicos do App
├── index.css                # Estilos globais e CSS variables (HSL)
└── main.tsx                 # Entry point da aplicação
```

## ⚙️ Configuração

### Backend do formulário de contato
O projeto usa Vercel Serverless Functions para o backend (sem servidor separado). A função `api/contact.ts` salva mensagens no Supabase e envia emails via Resend.

#### Setup Local
1) Crie um projeto no [Supabase](https://supabase.com) (gratuito)
2) Configure as variáveis de ambiente:
   - Copie [.env.example](.env.example) → `.env.local`
   - Preencha as credenciais do Supabase:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (obtenha em Project Settings → API)

3) Crie a tabela de contatos no Supabase (SQL Editor):
```sql
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "public insert contact messages"
on contact_messages for insert
to public
with check (true);
```

#### Email (Opcional)
Para enviar emails automaticamente:
1) Gere uma API key no [Resend](https://resend.com)
2) Configure no `.env.local`:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` (seu email)
   - `CONTACT_FROM_EMAIL` (opcional - padrão: `Portfolio <onboarding@resend.dev>`)

**Nota:** O email padrão `onboarding@resend.dev` já está verificado e funciona imediatamente. Para usar um domínio customizado (ex: `noreply@seudominio.com`), você precisa verificá-lo no painel do Resend adicionando registros DNS.

#### Desenvolvimento Local
Para rodar o frontend + APIs serverless localmente:
```bash
vercel dev
```

Se preferir apenas o frontend, rode:
```bash
npm run dev
```
e configure `VITE_API_URL` com a URL de produção do Vercel.

#### Deployment na Vercel

1) **Conectar GitHub:**
   - Ir para [vercel.com](https://vercel.com)
   - Conectar repositório

2) **Configurar variáveis de ambiente:**
   - Em `Settings → Environment Variables`, adicionar:
     - `SUPABASE_URL` (URL do projeto Supabase)
     - `SUPABASE_SERVICE_ROLE_KEY` (chave de serviço do Supabase)
     - `RESEND_API_KEY` (API key do Resend)
     - `CONTACT_TO_EMAIL` (seu email para receber mensagens)
     - `CONTACT_FROM_EMAIL` (opcional - padrão: `Portfolio <onboarding@resend.dev>`)
     - `VITE_SUPABASE_URL` (mesma URL do Supabase - para frontend)
     - `VITE_SUPABASE_ANON_KEY` (chave pública do Supabase - para frontend)

3) **Deploy automático:**
   - Cada push em `main` faz deploy automático
   - Frontend + Backend (Serverless) em um único lugar

#### Estrutura do Backend
- [api/contact.ts](api/contact.ts) - Serverless function:
  - `POST /api/contact` - Salva mensagem no Supabase, envia email
  - Timeout: 10s
  - Cold start: ~1-2s

### Vite
- Path alias `@` apontando para `src/`
- Dev server na porta 5173 (frontend)
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

## ⚡ Otimizações de Performance

### Code Splitting
O projeto usa `React.lazy()` para carregar componentes pesados sob demanda:
- **Certificates** - Carregado apenas quando próximo de ser visualizado
- **Projects** - Lazy loading com integração GitHub
- **Contact** - Componente carregado sob demanda

Cada seção tem um `Suspense` com fallback de skeleton para melhor UX.

**Arquivo:** [src/pages/Index.tsx](src/pages/Index.tsx)

### Lazy Loading de Imagens
Use o componente `LazyImage` para carregar imagens apenas quando visíveis:

```tsx
import { LazyImage } from "@/components/LazyImage";

export default function MyComponent() {
  return (
    <LazyImage
      src="/my-image.jpg"
      alt="Descrição"
      className="w-full h-auto"
    />
  );
}
```

Ou use o atributo nativo HTML:
```tsx
<img src="/image.jpg" alt="..." loading="lazy" decoding="async" />
```

**Arquivo:** [src/components/LazyImage.tsx](src/components/LazyImage.tsx)

## 📊 Status do Setup

### Frontend
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
✅ **Code splitting** (React.lazy + Suspense)  
✅ **Lazy loading de imagens** (native HTML loading="lazy")  

### Funcionalidades
✅ **Integração com GitHub API** (repositórios, atividade)  
✅ **Seções completas** (Hero, About, Projects, Certificates, Contact, Footer)  
✅ **Layout glassmorphism** com cards estilizados  
✅ **Animações suaves** (Framer Motion) com hover effects  
✅ **Formulário de contato** com Vercel Serverless + Supabase + Resend  
✅ **Footer com links sociais** (GitHub, LinkedIn, Email)  
✅ **Responsividade** mobile-first em todos os componentes  
✅ **Scroll smooth** entre seções  

### Backend
✅ Vercel Serverless Functions  
✅ Supabase (banco de dados)  
✅ Integração com Resend (envio de emails)  
✅ Deploy automático via GitHub  
✅ **Deploy em produção** (https://samialuvanicedev.vercel.app)  

### Performance
✅ **Code splitting** - Componentes pesados (Certificates, Projects, Contact) carregam sob demanda
✅ **Lazy loading de imagens** - Imagens carregam apenas quando visíveis na viewport
✅ **Loading skeletons** - Fallback visual durante carregamento de componentes
✅ **Vite otimizado** - Build ultra-rápido com chunking automático  

## 🎯 Próximos Passos Sugeridos

- [ ] Implementar analytics (Google Analytics ou Plausible)
- [ ] Otimizar SEO (meta tags, sitemap.xml, robots.txt)
- [ ] Adicionar testes unitários (Vitest + React Testing Library)
- [ ] Adicionar testes E2E (Playwright ou Cypress)
- [x] Deploy na Vercel (frontend + serverless) ✅
- [ ] Adicionar suporte a múltiplos idiomas (i18n)
- [ ] Melhorar tratamento de erros no backend
- [ ] Adicionar validação mais robusta no servidor
- [ ] Implementar PWA (Progressive Web App) com Service Workers
