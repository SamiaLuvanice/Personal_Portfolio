# Tarefas — 0005 Nome do hero inteiro enquanto a fonte carrega

- [x] **T1 — Medir.** Razões de largura e métricas verticais da Space Grotesk e da Sora contra Arial e Roboto, por peso, no Chromium.
- [x] **T2 — Red.** E2E com fontes bloqueadas nas seis larguras. Falhou em 320 px: a linha ia até 332 px, e o limite é 300.
- [x] **T3 — Green.** `@font-face` de fallback, pilhas no CSS e no Tailwind, `font-hero` no nome e na marca d'água. E2E verde.
- [x] **T4 — Aparência inalterada.** Screenshots da página inteira com a fonte carregada, antes e depois, idênticos em 390 e 1280 px.
- [x] **T5 — Verificação.** (produção pendente)
  - Portões e Lighthouse local.
  - Revisão independente e `docs-impact`.
  - Depois do merge: Lighthouse em produção.
