# Tarefas da spec 0003

- [x] T1. Medir o baseline do Lighthouse mobile da versão atual e registrar. *Refeito em `/`: a primeira medição caiu na rota 404.*
- [x] T2. Conteúdo e lógica pura: testes Red (módulos inexistentes) → Green, 15 testes.
- [x] T3. Imagens: screenshots dos quatro projetos e o retrato convertidos para WebP (18–41 KB cada).
- [x] T4. Superfícies e tokens: esquema fixo por seção; tema alternável, Sobre e Certificados removidos.
- [x] T5. Componentes com testes Red → Green: Projetos (filtro e cards) e Expertise (vários abertos, teclado), 7 testes; Hero, Experiência, Contato e rodapé.
- [x] T6. Navegação: barra superior a partir de 1024 px e inferior abaixo; seção ativa; âncoras sem cobrir títulos.
- [x] T7. Metadados SEO em `index.html`.
- [x] T8. E2E reescrito. Red na versão de `main`: 38 de 41 falham. Green no branch: 41 passam e 1 é pulado de propósito no desktop.
- [x] T9. Portões verdes: lint, typecheck, 22 testes unitários, build, 41 E2E.
- [x] T10. Lighthouse mobile em `/`.
  - Baseline: Performance 0,76–0,77, LCP 4,4–4,6 s.
  - Depois: Performance 0,98–0,99, Acessibilidade 1,0, LCP 2,1 s, CLS ≤ 0,009.
- [x] T11. Revisão independente (`code-reviewer`) e QA (`qa`). Achados tratados e verificados; ver `verification.md`.
- [x] T12. `docs-impact` listou `docs/architecture.md` e `README.md`. O agente `doc-sync-onboarding` atualizou os dois e o `docs/LEARNINGS.md`. `verification.md` registrado.
- [ ] Pendente fora deste branch: Lighthouse mobile no preview da Vercel, depois de abrir o PR.
