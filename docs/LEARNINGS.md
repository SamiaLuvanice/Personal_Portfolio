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

## 2026-11-13 — Medir acessibilidade só depois das animações

**Contexto:** o axe acusava contraste de 2,2:1 em textos da página porque media durante o fade de
entrada (Framer Motion/GSAP). Depois de rolar a página e esperar, sobraram violações reais: badges de
tecnologia com a cor da marca sobre fundo escuro e um botão de menu sem nome acessível.

**Princípio:** o teste e2e rola a página inteira e espera as animações assentarem antes do axe. Cor de
marca em texto passa por `color-mix` com preto ou branco (classe `.tech-badge`), mantendo o matiz.

**Anti-pattern:** desligar a regra `color-contrast` ou aumentar o timeout até o teste ficar verde.


**Referências:** `e2e/portfolio.spec.ts`, `src/index.css` (`.tech-badge`), `src/components/About.tsx`.
