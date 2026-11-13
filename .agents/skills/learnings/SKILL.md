---
name: learnings
description: >-
  Captura de aprendizados e evolução de boas práticas. Use após bug fix, feature ou revisão que
  revele padrão novo, anti-pattern ou regra que deva ser documentada, ou quando pedirem para
  "registrar aprendizado", "boa prática" ou "documentar isso".
---

# learnings

Quando surgir algo que **outros agentes precisarão saber**:

1. Regra de código → `.agents/rules/<tema>.md` (fonte única; as ferramentas leem por projeção).
2. Padrão de skill → a skill relevante em `.agents/skills/<tema>/SKILL.md`.
3. Aprendizado geral → `docs/LEARNINGS.md`, no formato:

```markdown
## AAAA-MM-DD — Nome curto

**Contexto:** o que aconteceu.
**Princípio:** a regra generalizável.
**Anti-pattern:** o que não fazer.
**Referências:** PR #, arquivo:linha.
```

Escale para regra quando aparecer duas ou mais vezes, corrigir uma categoria de bug ou mudar
convenção. Se a regra puder ser checada por máquina, prefira um script ou hook em `.agents/scripts/`
a mais prosa.
