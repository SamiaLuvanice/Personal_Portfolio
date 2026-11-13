---
description: Testes de comportamento.
---

# Testes

Teste a fronteira pública, não detalhes internos. Testes não dependem de ordem, relógio real,
credenciais ou rede externa: simule a fronteira (fetch, SDKs) e injete dependências.

- **Unidade/integração:** Vitest. Componentes com Testing Library, consultando por papel e rótulo
  acessível. Lógica pura (ex.: montagem de links) em funções testáveis de `src/lib/`.
- **E2E:** Playwright contra o build (`vite preview`), com checagem de acessibilidade (axe).
- **Auditoria:** Lighthouse CI com orçamento em `lighthouserc.json`.

Para comportamento novo: Red pelo motivo esperado → Green → Refactor (skill `tdd`).
