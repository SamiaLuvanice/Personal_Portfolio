---
description: Verifica critérios de aceite e portões de uma spec
argument-hint: <numero-da-spec>
---

Leia `specs/$ARGUMENTS-*/spec.md` e `plan.md`. Para cada critério de aceite, execute a demonstração e
registre observado, comando e limite em `verification.md`. Rode `node .agents/scripts/gates.mjs`
(lint, typecheck, testes, build e e2e) e, se a mudança afeta harness ou CI,
`node --test ".agents/scripts/*.test.mjs"` e `node .agents/scripts/diagnose.mjs`. Confirme contagem de
testes positiva. Revise segurança (segredos, validação, escape) e acessibilidade. Portão vermelho ou
critério não demonstrado permanece pendente. Feche com `.agents/rules/task-done-criteria.md`.
