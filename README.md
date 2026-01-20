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

### Development
- **ESLint** - Análise estática e linting de código
- **TypeScript** - Type checking e desenvolvimento type-safe

## 🎨 Design System

### Componentes UI
O projeto inclui componentes Shadcn/UI baseados em Radix UI:
- **Button** - Botão com variantes customizáveis
- **Toast/Toaster** - Sistema nativo de notificações via Radix UI
- **Sonner** - Alternativa moderna para toast notifications
- **Tooltip** - Dicas acessíveis com Radix UI

### Hooks Customizados
- **useToast()** - Hook para disparar notificações toast
- **useTheme()** - Hook para gerenciar tema dark/light (next-themes)

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
│   ├── Navbar.tsx       # Componente de navegação
│   ├── ThemeToggle.tsx  # Seletor de tema dark/light
│   └── ui/              # Componentes UI reutilizáveis
│       ├── button.tsx   # Componente Button (Shadcn/Radix)
│       ├── toast.tsx    # Sistema de notificações
│       ├── toaster.tsx  # Container das notificações
│       ├── tooltip.tsx  # Tooltips acessíveis
│       └── sonner.tsx   # Integração Sonner
├── hooks/
│   └── use-toast.ts     # Hook customizado para toast notifications
├── lib/
│   └── utils.ts         # Funções utilitárias (cn, etc.)
├── pages/
│   ├── Index.tsx        # Página principal
│   └── NotFound.tsx     # Página 404
├── App.tsx              # Componente raiz com routing
├── App.css              # Estilos específicos do App
├── index.css            # Estilos globais e CSS variables
└── main.tsx             # Entry point da aplicação
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

## 🎯 Próximos Passos Sugeridos

- [ ] Criar página de home com hero section
- [ ] Implementar seção de projetos/portfolio
- [ ] Adicionar formulário de contato
- [ ] Integrar com CMS ou backend
- [ ] Implementar analytics
- [ ] Otimizar SEO
- [ ] Adicionar testes unitários
