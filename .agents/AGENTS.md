# .agents — fonte única das instruções

Funciona com Codex, Claude Code, Cursor e OpenCode. Papéis ficam em `agents/`, regras em `rules/`,
skills em `skills/`, comandos em `commands/` e a automação do harness em `scripts/`.

## Núcleo agnóstico × perfil

- **Núcleo** (vale para qualquer stack): rules `workspace`, `evidencia`, `task-done-criteria`, `git`,
  `security`, `naming`, `testing`; agents `spec-reviewer`, `code-reviewer`, `qa`, `debugger`,
  `doc-sync-onboarding`; skills `spec-driven`, `tdd`, `quality-gates`, `learnings`, `bug-resolve`,
  `doc-sync-onboarding`; e os scripts de `scripts/`. Os scripts não citam arquivo, rota ou comando do
  projeto: o que é específico vem de `harness.yaml` ou das regras do perfil.
- **Perfil `react-vite-spa`**: rules `frontend`, `serverless-api`; skills `react-feature`,
  `react-vite-performance`, `frontend-design`, `shadcn`, `impeccable`, `seo-audit`.

O perfil ativo está em `modules.yaml`; use apenas o que estiver listado. Skills de terceiros têm origem e
hash em `skills-lock.json` e referências em `sources.md`; a seção "Uso no portfólio" de cada uma é
customização local e deve ser preservada em atualizações.

## Scripts (Node >= 20, sem dependências)

| Script | Uso |
|---|---|
| `scripts/sync.mjs` | Projeta `.agents/` para cada ferramenta e gera `.mcp.json`. `--check` no CI. |
| `scripts/gates.mjs` | Roda os portões de `harness.yaml` (`--skip-install`, `--only`, `--scope`, `--list`). |
| `scripts/commit-msg.mjs` | Hook `commit-msg`: Conventional Commits, branch protegida e autoria humana. `--range` no CI. |
| `scripts/docs-impact.mjs` | Lista documentos a revisar pelas mudanças (mapa `docs_impact`). |
| `scripts/diagnose.mjs` | Diagnóstico: perfil, imports, projeções, referências proibidas, segredos e worktrees integradas. |

Testes: `node --test ".agents/scripts/*.test.mjs"`. Os scripts são idênticos aos do bestprice; corrija
nos dois repositórios.

## Projeções

Claude usa `CLAUDE.md` (importa `AGENTS.md` e as regras sempre ativas) e links em `.claude/`; Codex lê
`AGENTS.md` e `.agents/skills` direto; OpenCode e Cursor recebem links e cópias geradas quando ativados em
`harness.yaml`. Nunca edite projeções. Configurações globais e plugins do cliente não são gerenciados aqui.
