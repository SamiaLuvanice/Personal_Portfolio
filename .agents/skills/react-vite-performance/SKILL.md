---
name: react-vite-performance
description: Revisar desempenho de componentes React e da SPA Vite. Use ao escrever ou refatorar componentes, animações, imagens e carregamento de módulos quando houver custo perceptível ou regressão no Lighthouse.
---

# Desempenho React/Vite

Meça antes e depois (Lighthouse CI, aba Performance, tamanho dos chunks no `vite build`) ao afirmar ganho.

- Importação dinâmica (`React.lazy`) para seções e bibliotecas pesadas abaixo da dobra; confira os chunks.
- Imagens: formato moderno, dimensões explícitas, `loading="lazy"` fora da dobra; a imagem do LCP não é lazy.
- Animações (GSAP/Framer Motion): anime `transform`/`opacity`, limpe timelines no unmount e respeite
  `prefers-reduced-motion`.
- Estado derivado no render; `memo`/`useMemo`/`useCallback` só contra custo medido.
- Requisições independentes em paralelo; cache de dados remotos com TanStack Query.
- Listeners de rolagem passivos quando não houver `preventDefault`.

Recursos de Next.js (RSC, `next/dynamic`, Server Actions) não se aplicam a esta SPA. Referência para
consulta: [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices).
