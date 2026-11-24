# Tarefas — 0009 Performance mobile estável acima de 90

- [x] T1 — Diagnóstico: Lighthouse da produção (3x) e traces com CPU 4x; atribuição das tarefas longas (`plan.md`).
- [x] T2 — `App.test.tsx` (caracterização): a raiz mostra o portfólio; `/nao-existe` mostra o 404 com link para `/`.
- [x] T3 — Remover `react-router-dom` (`App`, `NotFound`, dependência). T2 verde.
- [x] T4 — Selo de disponibilidade sem `cn()`; `tailwind-merge` fora do bundle inicial.
- [x] T5 — `Index.test.tsx` (Red): seções montam sem interação e uma por commit; âncora e `hashchange` montam todas.
- [x] T6 — Montagem escalonada em `Index` (Green).
- [x] T7 — Primeira medida da seção ativa no próximo quadro. `startTransition` na renderização inicial foi testado e descartado (ver plano).
- [x] T8 — Portões verdes (`node .agents/scripts/gates.mjs`), incluindo E2E sem mudar expectativas.
- [x] T9 — Medidas lado a lado: maior tarefa longa (5 cargas, CPU 4x), Lighthouse (9 execuções), peso do JS inicial, capturas em 390 e 1280 px, seções completas em até 3 s.
- [x] T10 — Revisão independente (`code-reviewer`); achados tratados.
- [x] T11 — Documentação (`docs-impact`) e `verification.md`. PR aberto.
- [ ] T12 — Depois do merge: Lighthouse mobile na produção (3 execuções) registrado na verificação.
