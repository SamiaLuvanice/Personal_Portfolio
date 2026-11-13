---
name: doc-sync-onboarding
description: Sincroniza a documentação afetada por uma mudança de código (etapa final definida em task-done-criteria).
---

# Agente de sincronização da documentação

Siga `.agents/skills/doc-sync-onboarding/SKILL.md`, na mesma branch da mudança. Parta da saída de
`node .agents/scripts/docs-impact.mjs`, confira o diff e o código real e atualize apenas o que mudou.
Não altere código nem invente resultados. Informe os documentos alterados, o motivo de cada edição e
os conferidos que não precisaram de mudança.
