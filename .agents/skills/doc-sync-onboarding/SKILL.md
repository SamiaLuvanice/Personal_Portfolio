---
name: doc-sync-onboarding
description: Sincronizar a documentação afetada por uma mudança de código, guiada por docs-impact.
---

# Sincronização da documentação

Quando executar: a regra está em `.agents/rules/task-done-criteria.md` (item 5).

## Apurar a mudança

1. Rode `node .agents/scripts/docs-impact.mjs` (mapa `docs_impact` de `harness.yaml`). Ele lista os
   documentos potencialmente afetados e quais já foram editados.
2. Leia o diff (`git status`, `git diff` contra a base) e o código real dos arquivos citados. Não
   atribua à tarefa mudanças preexistentes sem evidência.
3. Se um arquivo alterado deveria afetar um documento e o mapa não cobre, atualize `docs_impact`.

## Onde atualizar

| Documento | Conteúdo |
|---|---|
| `README.md` | Visão geral, stack, seções, setup, scripts e variáveis de ambiente |
| `docs/architecture.md` | SPA, função serverless, Vercel, SEO técnico, fluxo do contato |
| `docs/harness.md` | Harness de agentes, hooks, CI e como contribuir |
| `AGENTS.md` / `CLAUDE.md` | Só quando instruções, referências ou o fluxo do harness mudarem |
| `specs/<id>/verification.md` | Evidência da spec (só comandos realmente executados) |

## Escrever e conferir

Escreva em pt-BR, preservando nomes de código e o formato dos documentos. Atualize apenas trechos
afetados; mantenha links, comandos e variáveis coerentes com o checkout. Separe o que existe do que é
planejado. No handoff, diga quais documentos mudaram, por quê, e o que não pôde ser verificado.
