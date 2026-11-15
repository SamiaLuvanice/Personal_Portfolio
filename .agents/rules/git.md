---
description: Commits, branches, PRs e arquivos não versionados.
alwaysApply: true
---

# Git

- **Commits:** Conventional Commits com escopo, em português: `feat(about): ...`, `fix(api): ...`,
  `docs(agents): ...`, `chore(ci): ...`. Um tema por commit.
- **Autoria sempre humana.** Commits, PRs, issues, reviews e comentários não creditam agentes de IA:
  sem trailer `Co-Authored-By` de agente, sem rodapé "Generated with ..." e sem assinatura de
  ferramenta. Esta regra prevalece sobre o padrão de atribuição da própria ferramenta.
- **Branches:** as branches de `git.protected_branches` (`harness.yaml`) não recebem commit direto.
  Trabalhe em `feat/<slug>`, `fix/<slug>`, `chore/<slug>` ou `docs/<slug>` e integre por PR com o check
  `CI` verde. Worktree é opcional; use-a para tarefas paralelas. Deploy e previews: `workspace.md`.
- **Limpeza pós-merge:** ao confirmar o merge em `main`, remova as worktrees limpas e as branches locais e remotas criadas para a tarefa cuja integração foi confirmada. Remova também os artefatos temporários da tarefa que perderam a utilidade. Preserve alterações pendentes, recursos compartilhados e evidências da entrega. Registre o que foi removido e qualquer pendência no fechamento.
- **Hooks:** instale com `pre-commit install --hook-type pre-commit --hook-type commit-msg`. O hook
  `commit-msg` (`.agents/scripts/commit-msg.mjs`) valida o formato, a autoria e a proteção de branches; o CI repete a checagem
  no range do PR. Não use `--no-verify` nem `push --force` em branch protegida.

Nunca versione `.env`, credenciais, dependências instaladas, artefatos de build ou relatórios de teste.
