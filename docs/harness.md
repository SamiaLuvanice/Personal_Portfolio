# Harness de agentes e qualidade

O harness é agnóstico de ferramenta: `.agents/` é a fonte única para Claude Code, Codex, OpenCode e
Cursor. Ele segue o modelo do projeto bestprice, e o núcleo (`.agents/scripts/`) é idêntico nos dois
repositórios.

## Estrutura

| Caminho | Papel |
|---|---|
| `AGENTS.md` | Entrada para Codex/OpenCode/Cursor; o `CLAUDE.md` importa este arquivo e as regras sempre ativas |
| `harness.yaml` | Configuração: ferramentas, perfil, branches protegidas, portões, `diagnose`, `docs_impact` |
| `.agents/modules.yaml` | O que é núcleo agnóstico e o que é do perfil `react-vite-spa` |
| `.agents/rules/`, `agents/`, `skills/`, `commands/` | Regras, papéis, skills e comandos (`/spec`, `/plan`, `/implement`, `/verify`) |
| `.agents/mcp.json` | MCP no formato agnóstico; o sync gera `.mcp.json` |
| `.agents/scripts/` | Automação em Node, sem dependências (ver tabela abaixo) |
| `skills-lock.json` | Origem e hash das skills de terceiros |

## Scripts

| Comando | Uso |
|---|---|
| `node .agents/scripts/sync.mjs` | Cria as projeções (`.claude/agents`, `.claude/skills`, `.claude/commands`, …) e gera `.mcp.json`. `--check` no CI |
| `node .agents/scripts/gates.mjs` | Roda os portões de `harness.yaml` (`npm run check` = sem instalar) |
| `node .agents/scripts/commit-msg.mjs` | Hook `commit-msg`; `--range a..b` no CI |
| `node .agents/scripts/docs-impact.mjs` | Lista documentos a revisar pelas mudanças |
| `node .agents/scripts/diagnose.mjs` | Valida perfil, imports, projeções, termos da stack no núcleo, referências proibidas e segredos |

## Primeiro uso

```bash
npm ci
node .agents/scripts/sync.mjs                                   # projeções das ferramentas
pip install pre-commit
pre-commit install --hook-type pre-commit --hook-type commit-msg  # hooks locais
```

## Hooks locais (pre-commit)

- `commit-msg`: Conventional Commits, **sem atribuição a agentes de IA** (nada de `Co-Authored-By` de
  agente nem "Generated with") e sem commit direto em `main`.
- `gitleaks`: varredura de segredos nos arquivos em stage.
- Higiene: espaços em branco, fim de arquivo, YAML/JSON, conflito, arquivo grande, chave privada.

## CI (`.github/workflows/ci.yml`)

| Job | O que valida |
|---|---|
| Quality | lint, typecheck, Vitest e build, via `gates.mjs` |
| E2E + acessibilidade | Playwright (desktop e mobile) com axe, sem violações sérias ou críticas |
| Lighthouse | acessibilidade ≥ 0,9 e SEO ≥ 0,9 (bloqueiam); boas práticas ≥ 0,9 e desempenho ≥ 0,7 (avisos) |
| Harness | testes do núcleo, `sync --check`, `diagnose` e actionlint |
| Commit policy | a política de commits em todo o range do PR |
| Secrets | gitleaks nos commits do evento |
| **CI** | agregador; deve ser o check obrigatório na proteção de `main` |

As actions são fixadas por SHA. A Vercel publica o preview de cada PR e a produção a partir de `main`.

## Fluxo de trabalho

1. Crie uma branch `feat/…`, `fix/…`, `chore/…` ou `docs/…` a partir de `main`.
2. Para uma mudança de comportamento, use `/spec → /plan → /implement → /verify` (skill `spec-driven`).
   Um ajuste trivial vai direto.
3. Feche a tarefa conforme `.agents/rules/task-done-criteria.md`: portões verdes, revisão independente
   (agente `code-reviewer`) e `docs-impact` como etapa final.
4. Abra o PR com o template, confira o preview da Vercel e faça o merge com o `CI` verde.

## Configuração manual no GitHub (uma vez)

- Proteção de `main`: exigir PR e o check `CI`, e bloquear push forçado.
