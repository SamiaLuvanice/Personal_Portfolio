import type { ExpertisePreviewKind } from "@/content/portfolio";

/** Prévias desenhadas em HTML a partir de fatos verificados no repositório do BestPrice IA. */

const Frame = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <figure className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 font-display text-sm md:p-7 md:text-[0.9375rem]">
    <figcaption className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</figcaption>
    {children}
  </figure>
);

const Box = ({ title, detail, tone }: { title: string; detail: string; tone: string }) => (
  <div className="flex-1 rounded-xl border bg-white/5 px-3 py-2.5" style={{ borderColor: tone }}>
    <p className="font-medium">{title}</p>
    <p className="text-xs text-muted-foreground">{detail}</p>
  </div>
);

const API_RULES: [string, string][] = [
  ["Link de anúncio válido", "201 / 200"],
  ["URL inválida, busca ou categoria", "400"],
  ["Vínculo duplicado", "409"],
  ["Intervalo mínimo de atualização", "429"],
  ["Integração ainda não validada", "503"],
  ["GET /api/health → SELECT 1", "200"],
];

const GATES = [
  "backend $ uv run ruff check .",
  "backend $ uv run pytest -q",
  "frontend $ npm run lint",
  "frontend $ npm test -- --run",
  "frontend $ npm run build:check",
  "$ docker compose up --build",
];

const ExpertisePreview = ({ kind }: { kind: ExpertisePreviewKind }) => {
  switch (kind) {
    case "frontend":
      return (
        <img
          src="/projects/bestprice.webp"
          alt="Interface do BestPrice IA com monitoramento de preço e gráfico de histórico"
          width={1200}
          height={750}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full rounded-2xl border border-border object-cover object-top"
        />
      );
    case "backend":
      return (
        <Frame label="BestPrice IA · regras na API (FastAPI)">
          <dl className="flex flex-col gap-2.5">
            {API_RULES.map(([rule, status]) => (
              <div key={rule} className="flex items-center justify-between gap-3">
                <dt>{rule}</dt>
                <dd className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium">{status}</dd>
              </div>
            ))}
          </dl>
        </Frame>
      );
    case "architecture":
      return (
        <Frame label="BestPrice IA · visão de arquitetura">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <Box title="React SPA" detail="Vite · Tailwind" tone="hsl(188 88% 48% / 0.7)" />
              <Box title="FastAPI" detail="REST · proxy Nginx" tone="hsl(0 0% 100% / 0.35)" />
              <Box title="PostgreSQL" detail="SQLAlchemy · Alembic" tone="hsl(188 88% 48% / 0.7)" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Box title="Worker" detail="lotes · concorrência" tone="hsl(0 0% 100% / 0.35)" />
              <Box title="API do Mercado Livre" detail="OAuth · tokens cifrados" tone="hsl(305 100% 47% / 0.7)" />
            </div>
            <Box title="Assistente de IA" detail="Gemini · opcional, desligado por padrão" tone="hsl(305 100% 47% / 0.7)" />
          </div>
        </Frame>
      );
    case "devops":
      return (
        <Frame label="Portões de qualidade · BestPrice IA">
          <ul className="flex flex-col gap-2 font-mono text-xs md:text-sm">
            {GATES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Frame>
      );
    case "ai":
      return (
        <Frame label="Fluxo spec-driven com agentes de código">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["/spec", "/plan", "/implement", "/verify"].map((step, index) => (
              <li key={step} className="rounded-xl border border-border bg-white/5 px-3 py-3">
                <span className="block text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </Frame>
      );
  }
};

export default ExpertisePreview;
