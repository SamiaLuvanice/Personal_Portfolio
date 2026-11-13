---
description: Critérios de conclusão de uma tarefa (fonte única, inclusive da sincronização de docs).
alwaysApply: true
---

# Tarefa pronta

Uma tarefa só está pronta com:

1. Critérios de aceite demonstrados (em `/verify` quando houver spec).
2. Portões verdes: `node .agents/scripts/gates.mjs` (ou o subconjunto da camada tocada, com
   `--only`/`--scope`), com contagem de testes positiva.
3. Testes de comportamento cobrindo sucesso e o erro principal.
4. Revisão independente do diff (agente `code-reviewer` ou pessoa) com achados tratados.
5. **Documentação sincronizada — etapa final.** Depois da última alteração de código, rode
   `node .agents/scripts/docs-impact.mjs`. Se listar documentos a revisar, execute o agente
   `.agents/agents/doc-sync-onboarding.md`; se não listar, registre isso no handoff. Se o código mudar
   de novo, repita. Esta é a única definição da regra; os demais arquivos apenas a referenciam.

Registre comandos e resultados reais. Item não executado é pendência explícita no handoff/PR.
