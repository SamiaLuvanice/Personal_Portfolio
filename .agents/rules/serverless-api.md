---
description: Funções serverless da Vercel em api/.
---

# API serverless

- Cada arquivo `api/<nome>.ts` é uma função da Vercel (`/api/<nome>`); código compartilhado e lógica
  testável ficam em `api/_lib/` (o prefixo `_` impede que vire rota).
- O handler só adapta HTTP: método, parse, status. A regra (validação, persistência, e-mail) fica em
  funções com dependências injetadas, testadas com Vitest.
- Contrato: `POST` com JSON; `400` para entrada inválida (mensagem segura), `405` para método,
  `500` genérico para falha interna. Nunca devolva mensagem de erro do banco ou do provedor.
- Variáveis de servidor sem prefixo `VITE_`. Em desenvolvimento, `npm run dev` serve `api/` pelo
  próprio Vite (plugin em `vite.config.ts`) com as variáveis de `.env`.

Evidência: resposta real (`curl -i` em `/api/<nome>`), logs da função na Vercel e testes.
