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

### APIs & Integração
- **GitHub API** - Integração com repositórios e dados do GitHub

### Development & Qualidade
- **ESLint** (flat config, `--max-warnings=0`) e **TypeScript** em modo `strict`
- **Vitest + Testing Library** - testes de unidade e de componentes
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
- Logos de tecnologias no About (`react-icons` + SVGs customizados)
- Animações customizadas (float, fade, slide, scale)
- Sombras suaves e glow effects
- Transições smooth e bounce
- Componentes responsivos

## 🚀 Como Executar

Requer Node 22 (`.nvmrc`).

```bash
npm ci                 # instala dependências
cp .env.example .env   # preencha as variáveis (o .env nunca é versionado)
npm run dev            # SPA + /api/* em http://localhost:8080
```

| Script | O que faz |
|---|---|
| `npm run dev` | Vite com HMR; serve também as funções de `api/` (mesmo código da Vercel) |
| `npm run build` / `npm run preview` | Build de produção e preview local |
| `npm run lint` | ESLint sem avisos tolerados |
| `npm run typecheck` | TypeScript estrito para app, configs e `api/` |
| `npm test` | Vitest (unidade e componentes) |
| `npm run test:e2e` | Playwright + axe contra o build (instale antes: `npx playwright install chromium`) |
| `npm run lighthouse` | Lighthouse CI sobre `dist/` (rode `npm run build` antes) |
| `npm run check` | Todos os portões de `harness.yaml` |

## 📁 Estrutura do Projeto

```
.agents/                 # Harness de agentes (fonte única; ver docs/harness.md)
api/
├── contact.ts           # Função serverless da Vercel (adaptador HTTP)
└── _lib/contact.ts      # Regra do contato: validação, escape e envio (testada)
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
   - Copie [.env.example](.env.example) → `.env` (ignorado pelo Git)
   - Preencha `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API)
   - Nunca use prefixo `VITE_` para chaves: ele publica o valor no bundle do navegador

3) Crie a tabela de contatos no Supabase (SQL Editor):
```sql
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- RLS ligado e SEM policies: só a função (service role) grava. Uma policy de insert
-- pública deixaria qualquer pessoa inserir direto pela API REST, pulando a validação.
alter table contact_messages enable row level security;
```

Se o projeto já tinha a policy antiga, remova-a: `drop policy if exists "public insert contact messages" on contact_messages;`

#### Email (Opcional)
Para enviar emails automaticamente:
1) Gere uma API key no [Resend](https://resend.com)
2) Configure no `.env`:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` (seu email)
   - `CONTACT_FROM_EMAIL` (opcional - padrão: `Portfolio <onboarding@resend.dev>`)

**Nota:** O email padrão `onboarding@resend.dev` já está verificado e funciona imediatamente. Para usar um domínio customizado (ex: `noreply@seudominio.com`), você precisa verificá-lo no painel do Resend adicionando registros DNS.

#### Desenvolvimento Local
`npm run dev` já serve `POST /api/contact` pelo próprio Vite, carregando o `.env`. Não é preciso `vercel dev` nem servidor separado.

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

3) **Deploy automático:**
   - Cada PR ganha um preview; cada merge em `main` vai para produção
   - O GitHub Actions (`.github/workflows/ci.yml`) só valida; quem publica é a Vercel
   - `vercel.json` define o fallback da SPA e cabeçalhos de segurança/cache

#### Estrutura do Backend
- [api/contact.ts](api/contact.ts) - adaptador HTTP da função `POST /api/contact`
- [api/_lib/contact.ts](api/_lib/contact.ts) - valida com Zod (limites de tamanho), escapa HTML do e-mail, salva no Supabase e notifica via Resend
- Respostas: `200 { ok: true }`, `400` dados inválidos, `405` método, `500` genérico (sem detalhes internos)
- Anti-spam: campo honeypot invisível (`website`); envios que o preenchem são descartados

### Vite
- Path alias `@` apontando para `src/`
- Dev server na porta 8080, com plugin que serve `api/*.ts` localmente
- Suporte a Hot Module Replacement (HMR)

### TypeScript
- Modo `strict` em todos os projetos (`tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.api.json`)
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
- `tsconfig.api.json` - Funções serverless em `api/`

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
- [x] Otimizar SEO (canonical, Open Graph, sitemap.xml, robots.txt)
- [x] Adicionar testes unitários (Vitest + React Testing Library)
- [x] Adicionar testes E2E (Playwright + axe)
- [ ] Imagem Open Graph (`og:image`) para prévias em redes sociais
- [ ] Adicionar suporte a múltiplos idiomas (i18n)
- [x] Melhorar tratamento de erros no backend
- [x] Adicionar validação mais robusta no servidor
- [ ] Implementar PWA (Progressive Web App) com Service Workers
