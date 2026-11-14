---
name: agent-orchestration
description: Coordenar a execução de uma spec do portfólio com divisão de tarefas, revisão, QA e evidência. Use quando o trabalho envolver delegação ou coordenação entre esses papéis.
---

# Orquestração de uma spec

1. Leia `spec.md`, `plan.md` e `tasks.md`. Se faltarem o plano ou as tarefas, siga [plan](../../commands/plan.md) antes de dividir o trabalho. Confirme os critérios de aceite, a ordem das tarefas, a branch de trabalho e as dependências entre mudanças. Siga a [regra Git](../../rules/git.md) para integração e escolha uma worktree quando houver trabalho paralelo.
2. Para cada tarefa delegada, cite o arquivo do papel em `.agents/agents/` quando existir e indique arquivos sob responsabilidade, dependências, critérios de aceite e evidência esperada. Execute em paralelo apenas tarefas com escopos independentes e arquivos sem sobreposição.
3. Use [implement](../../commands/implement.md) para acompanhar as tarefas. Peça evidência em cada transição, como Red e Green para mudanças de comportamento e uma demonstração do fluxo real quando aplicável. Atualize `tasks.md` e registre em `verification.md` os comandos, resultados e limites.
4. Encaminhe o diff ao [code-reviewer](../../agents/code-reviewer.md) ou a uma pessoa, e os critérios de aceite ao [QA](../../agents/qa.md) quando houver delegação. Retorne achados para a implementação e verifique as correções antes de fechar.
5. Siga [verify](../../commands/verify.md) e os [critérios de conclusão](../../rules/task-done-criteria.md), incluindo a checagem de documentação. Quando houver PR no escopo, use a branch base configurada em `harness.yaml` e inclua spec, evidências e a Issue se existir.
