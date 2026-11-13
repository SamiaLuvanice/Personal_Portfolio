#!/usr/bin/env node
// Diagnóstico do harness, multiplataforma e usado também no CI:
//   - arquivos obrigatórios, imports do CLAUDE.md e itens do perfil ativo existem;
//   - skills travadas em skills-lock.json existem;
//   - projeções MCP em dia (mesma checagem de sync.mjs --check);
//   - nenhuma referência proibida (harness.yaml → diagnose.forbidden_refs);
//   - nenhum segredo aparente em arquivos versionáveis;
//   - avisa worktrees cuja branch já foi integrada (limpeza pendente).
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, asList, git, globToRegExp, loadHarness, parseYaml } from "./lib.mjs";
import { sync } from "./sync.mjs";

const REQUIRED = ["harness.yaml", "AGENTS.md", "CLAUDE.md", ".agents/AGENTS.md", ".agents/modules.yaml"];
const TEXT_FILE = /(\.(md|mdc|ya?ml|json|py|ps1|sh|cjs|mjs|js|jsx|ts|tsx|toml|txt|html|css|env\.example)|Dockerfile)$/i;
const ALWAYS_IGNORED = /(^|\/)(node_modules|\.venv|__pycache__|\.pytest_cache|dist|coverage|archive|\.worktrees)(\/|$)/;

export const SECRET_PATTERNS = [
  { name: "chave privada PEM", regex: /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: "senha literal", regex: /(?:password|passwd|senha)\s*[:=]\s*["'][^"'$\s{<][^"']{5,}["']/i },
  // Valor com cara de token: sem espaços/colchetes, com ao menos um dígito.
  { name: "segredo literal", regex: /(?:secret|api[_-]?key|token)\s*[:=]\s*["'](?=[^"']*\d)[A-Za-z0-9_\-+/=.]{12,}["']/i },
  { name: "JWT", regex: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
  { name: "token GitHub", regex: /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{60,})\b/ },
  { name: "chave AWS", regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "chave Resend", regex: /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}\b/ },
  { name: "chave OpenAI/Anthropic", regex: /\bsk-(ant-)?[A-Za-z0-9_-]{32,}\b/ },
];

export function findSecrets(content) {
  return SECRET_PATTERNS.filter((pattern) => pattern.regex.test(content)).map((pattern) => pattern.name);
}

function claudeImports(root) {
  const text = readFileSync(join(root, "CLAUDE.md"), "utf8");
  return [...text.matchAll(/^@(\S+)\s*$/gm)].map((match) => match[1]);
}

function profileItems(root, harness) {
  const modules = parseYaml(readFileSync(join(root, ".agents/modules.yaml"), "utf8"));
  const profile = modules.profiles?.[harness.profile?.name] ?? {};
  const pick = (kind) => [...asList(modules.core?.[kind]), ...asList(profile[kind])];
  return [
    ...pick("rules").map((name) => `.agents/rules/${name.endsWith(".md") ? name : `${name}.md`}`),
    ...pick("skills").map((name) => `.agents/skills/${name}/SKILL.md`),
    ...pick("agents").map((name) => `.agents/agents/${name}.md`),
  ];
}

function versionableFiles(root, ignoreGlobs) {
  const listed = git(["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root }) ?? "";
  const ignored = ignoreGlobs.map(globToRegExp);
  return listed
    .split("\n")
    .filter(Boolean)
    .filter((file) => TEXT_FILE.test(file) && !ALWAYS_IGNORED.test(file))
    .filter((file) => !ignored.some((regex) => regex.test(file)))
    .filter((file) => existsSync(join(root, file)) && statSync(join(root, file)).isFile());
}

function staleWorktrees(root, base) {
  const output = git(["worktree", "list", "--porcelain"], { cwd: root, allowFailure: true }) ?? "";
  const merged = new Set(
    (git(["branch", "--merged", base, "--format=%(refname:short)"], { cwd: root, allowFailure: true }) ?? "")
      .split("\n")
      .filter(Boolean),
  );
  const stale = [];
  let path = null;
  for (const line of output.split("\n")) {
    if (line.startsWith("worktree ")) path = line.slice(9);
    if (line.startsWith("branch ")) {
      const branch = line.slice(7).replace("refs/heads/", "");
      if (path && path.replace(/\\/g, "/") !== root.replace(/\\/g, "/") && merged.has(branch)) {
        stale.push(`${branch} (${path})`);
      }
    }
  }
  return stale;
}

export function diagnose(root = ROOT) {
  const errors = [];
  const warnings = [];
  for (const file of REQUIRED) if (!existsSync(join(root, file))) errors.push(`arquivo ausente: ${file}`);
  if (errors.length > 0) return { errors, warnings };

  const harness = loadHarness(root);
  for (const file of claudeImports(root)) {
    if (!existsSync(join(root, file))) errors.push(`CLAUDE.md importa arquivo inexistente: ${file}`);
  }
  for (const file of profileItems(root, harness)) {
    if (!existsSync(join(root, file))) errors.push(`item do perfil ativo ausente: ${file}`);
  }
  const lockPath = join(root, "skills-lock.json");
  if (existsSync(lockPath)) {
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    for (const name of Object.keys(lock.skills ?? {})) {
      if (!existsSync(join(root, ".agents/skills", name, "SKILL.md"))) {
        errors.push(`skill travada em skills-lock.json sem pasta: .agents/skills/${name}`);
      }
    }
  }
  try {
    sync({ root, check: true, log: () => {} });
  } catch (error) {
    errors.push(error.message);
  }

  const config = harness.diagnose ?? {};
  const forbidden = asList(config.forbidden_refs).map(String);
  const ignoreGlobs = ["harness.yaml", ".agents/scripts/*.test.mjs", ...asList(config.ignore_paths)];
  for (const file of versionableFiles(root, ignoreGlobs)) {
    const content = readFileSync(join(root, file), "utf8");
    for (const value of forbidden) {
      if (content.includes(value)) errors.push(`referência proibida "${value}" em ${file}`);
    }
    for (const kind of findSecrets(content)) errors.push(`possível segredo (${kind}) em ${file}`);
  }

  const base = `origin/${harness.git?.default_base ?? "main"}`;
  for (const worktree of staleWorktrees(root, base)) {
    warnings.push(`worktree com branch já integrada em ${base}: ${worktree} — aplicar task-cleanup`);
  }
  return { errors, warnings };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { errors, warnings } = diagnose();
  for (const warning of warnings) console.warn(`aviso: ${warning}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`erro: ${error}`);
    process.exit(1);
  }
  console.log(`Harness válido: ${ROOT}`);
}
