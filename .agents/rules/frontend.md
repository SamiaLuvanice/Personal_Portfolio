---
description: Convenções de React, TypeScript, Vite e Tailwind neste projeto.
---

# Frontend

- Componentes funcionais e TypeScript. Dados da rede entram como `unknown` e são validados antes do
  uso; evite `any`. Chamadas HTTP ficam em módulos tipados em `src/lib/` com URL relativa (`/api`).
- Trate carregamento, sucesso, erro HTTP e falha de rede como estados distintos quando isso mudar a
  experiência; só mostre sucesso com a resposta validada.
- HTML semântico, um `h1` por página, foco visível, contraste AA, `alt` em imagens e respeito a
  `prefers-reduced-motion` nas animações (GSAP/Framer Motion).
- Reutilize `src/components/ui/` (shadcn) e os tokens de `src/index.css`/`tailwind.config.ts` antes de
  criar estilos novos. Imagens otimizadas e com dimensões; carregamento preguiçoso fora da dobra.
- SEO: metadados em `index.html`, `public/robots.txt` e `public/sitemap.xml` coerentes com a URL de produção.

Evidência: saída de `npm run lint`/`typecheck`/`build`, Console e Network do navegador, relatório do
Playwright/axe e do Lighthouse.
