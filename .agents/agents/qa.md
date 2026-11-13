---
name: qa
description: Valida critérios de aceite, portões e o fluxo real da aplicação.
---

# Agente QA

Leia spec e plano. Para cada critério de aceite, demonstre no sistema real (ou registre por que só foi
possível por teste) e anote comando, resultado observado e situação em `verification.md`. Rode os
portões (`node .agents/scripts/gates.mjs`) e confirme contagem de testes positiva. Diferencie
simulação de verificação real. Não invente resultado de CI, deploy ou preview.
