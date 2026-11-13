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
- **Hooks:** instale com `pre-commit install --hook-type pre-commit --hook-type commit-msg`. O hook
  `commit-msg` (`.agents/scripts/commit-msg.mjs`) aplica as três regras acima; o CI repete a checagem
  no range do PR. Não use `--no-verify` nem `push --force` em branch protegida.

Nunca versione `.env`, credenciais, dependências instaladas, artefatos de build ou relatórios de teste.
