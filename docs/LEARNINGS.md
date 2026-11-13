# Aprendizados

Formato e critério de escalada: `.agents/skills/learnings/SKILL.md`.

## 2026-11-13 — `.env` fora do Git desde o primeiro commit

**Contexto:** o `.env` com a chave de serviço do Supabase e a chave do Resend estava versionado em
repositório público porque o `.gitignore` só cobria `*.local`.

**Princípio:** `.env` e `.env.*` entram no `.gitignore` antes de qualquer segredo existir; a
varredura de segredos roda no pre-commit e no CI. Vazamento se resolve rotacionando a chave.

**Anti-pattern:** confiar só em `detect-private-key` (detecta PEM, não tokens) ou apagar o arquivo
achando que o histórico some.

**Referências:** `.gitignore`, `.pre-commit-config.yaml`, `.github/workflows/ci.yml`.
