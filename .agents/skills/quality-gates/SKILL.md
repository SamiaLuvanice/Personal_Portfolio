---
name: quality-gates
description: Rodar e interpretar os portões de qualidade (lint, tipos, testes, build, e2e) e as checagens do harness.
---

# Portões de qualidade

Os comandos vivem em `harness.yaml` (seção `quality`), fonte única para uso local e CI:

- Todos: `node .agents/scripts/gates.mjs` (`--skip-install` se as dependências já estão instaladas).
- Subconjunto: `--only lint,typecheck,test` ou `--scope <escopo>`; `--list` mostra o plano.
- Harness: `node --test ".agents/scripts/*.test.mjs"`, `node .agents/scripts/sync.mjs --check` e
  `node .agents/scripts/diagnose.mjs`.
- Commits do PR: `node .agents/scripts/commit-msg.mjs --range origin/<base>..HEAD`.

Confirme contagem de testes maior que zero. Não marque skip ou teste não executado como verde. Se uma
ferramenta ou serviço não estiver disponível (ex.: navegador do Playwright), reporte a pendência
concreta. No GitHub, o check agregador `CI` precisa passar para o merge.
