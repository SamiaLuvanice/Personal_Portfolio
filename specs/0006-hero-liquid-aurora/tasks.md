# Tarefas — 0006 Hero Liquid Aurora

- [x] T1 — Retrato novo em `public/hero/portrait-2026.webp` (720×958, alfa; nome novo por causa do cache de 7 dias em `/hero/*`).
- [x] T2 — `src/lib/aurora.ts`: testes de `localPoint`, `approach`, `smoothingFactor` e `isSettled` (Red), depois a implementação (Green).
- [x] T3 — `Hero.test.tsx` (Red): h1, ações, links por ícone, camadas decorativas ocultas, revelação por ponteiro com suavização (relógio simulado), toque e sem hover fino.
- [x] T4 — `use-hero-aurora` (`useAuroraPointer`, `useHeroMotion`) + `HeroAurora` + novo `Hero` (Green).
- [x] T5 — Estilos em `src/index.css`: modos ponteiro/ambiente/estático, decoração progressiva, deriva, entrada, cores forçadas, posição da foto no desktop.
- [x] T5b — Desempenho: aurora pré-renderizada (`scripts/generate-hero-aurora.mjs`), máscaras estáticas, movimento após o carregamento (ver plano e verificação).
- [x] T6 — E2E (Red → Green): ações, revelação por ponteiro, movimento reduzido, ambiente no toque, pausa fora da tela, rosto livre em 320/390 px, aurora só após o carregamento, cores forçadas.
- [x] T7 — Conferência visual em 320, 390, 768, 1024, 1280 e 1440 px contra o Figma.
- [x] T8 — Portões verdes e Lighthouse local comparado com a `main`.
- [x] T9 — Revisão independente (`code-reviewer`) e QA (`qa`); achados tratados.
- [x] T10 — Documentação sincronizada, PR com preview conferido; Lighthouse em produção após o merge.
