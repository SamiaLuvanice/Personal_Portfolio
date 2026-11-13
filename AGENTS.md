# Harness do projeto

Portfólio pessoal de Sâmia Luvanice: SPA React 18 + TypeScript + Vite + Tailwind/shadcn, com uma
função serverless (`api/contact.ts`) para o formulário de contato (Supabase + Resend). Deploy na
**Vercel**. Priorize simplicidade, acessibilidade, desempenho e SEO; explique o porquê das decisões.

Toda configuração de agentes vive em `.agents/`, a fonte única de verdade (ver `.agents/AGENTS.md`).

- Papéis: `.agents/agents/` · Skills: `.agents/skills/` · Comandos: `.agents/commands/` · Regras: `.agents/rules/`
- Fluxo para mudança de comportamento: `/spec → /plan → /implement (TDD) → /verify`; ajustes triviais vão direto (skill `spec-driven`).
- Portões: `node .agents/scripts/gates.mjs` (comandos em `harness.yaml`).
- Fechamento de tarefa: `.agents/rules/task-done-criteria.md` (inclui a checagem de documentação).

## Regras sempre ativas

Leia antes de qualquer tarefa: `.agents/rules/workspace.md`, `evidencia.md`, `task-done-criteria.md` e `git.md`.

## Regras por tema

Interface: `frontend.md`. API serverless: `serverless-api.md`. Transversais: `naming.md`, `testing.md`, `security.md`.

## Skills, agents e comandos

Leia `.agents/skills/<nome>/SKILL.md` quando a descrição combinar com a tarefa; cite `.agents/agents/<papel>.md` ao delegar. Sem slash-command na ferramenta, leia `.agents/commands/<nome>.md`; `$ARGUMENTS` é o argumento do pedido.

Este arquivo é lido por Codex, Cursor e OpenCode; Claude importa via `CLAUDE.md`. Pastas `.claude/agents`, `.claude/skills`, `.claude/commands`, `.opencode/` e `.cursor/` são projeções: edite `.agents/` e rode `node .agents/scripts/sync.mjs` (ou `.agents/sync.ps1` / `bash .agents/sync.sh`).

MCP: a fonte é `.agents/mcp.json` (formato agnóstico `mcpServers`); o sync gera `.mcp.json`. Não edite o gerado. Use o Context7 para documentação de bibliotecas quando a versão importar.
