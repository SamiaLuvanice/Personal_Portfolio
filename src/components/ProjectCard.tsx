import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/portfolio";

const CATEGORY_LABEL = { autoral: "Autoral", comercial: "Comercial" } as const;
// O laranja fica reservado às ações; as categorias usam magenta e ciano.
const CATEGORY_DOT = { autoral: "bg-accent", comercial: "bg-[hsl(var(--tertiary))]" } as const;

/** Card inteiro clicável: imagem, categoria, título curto e duas tags (spec 0003). */
// O nome acessível vem do conteúdo visível (WCAG 2.5.3): imagem, categoria, título, tags e aviso.
const ProjectCard = ({ project }: { project: Project }) => (
  <a
    href={project.url}
    target="_blank"
    rel="noopener noreferrer"
    className="project-card group flex h-full flex-col gap-3 rounded-[1.25rem] border border-border bg-card p-2 transition-shadow duration-300 hover:shadow-[0_20px_48px_-24px_hsl(240_20%_10%/0.35)] md:gap-4 md:rounded-3xl md:p-2.5"
  >
    <div className="relative overflow-hidden rounded-[0.875rem] bg-muted md:rounded-2xl">
      <img
        src={project.image.src}
        alt={project.image.alt}
        width={1200}
        height={750}
        loading="lazy"
        decoding="async"
        className="project-card-image aspect-[2/1] w-full object-cover object-top md:aspect-[16/10]"
      />
      <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-display text-xs font-medium uppercase tracking-[0.08em] text-foreground">
        <span aria-hidden="true" className={`h-2 w-2 rounded-full ${CATEGORY_DOT[project.category]}`} />
        {CATEGORY_LABEL[project.category]}
      </span>
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 hidden h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--surface-dark))] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:inline-flex"
      >
        <ArrowUpRight className="h-5 w-5" />
      </span>
    </div>
    <div className="flex flex-col gap-3 px-2 pb-2 md:gap-4 md:px-2.5 md:pb-3">
      <h3 className="font-display text-lg font-medium leading-snug md:text-2xl">{project.title}</h3>
      <ul aria-label="Tags" className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-border px-3 py-1 text-xs font-medium md:px-4 md:py-1.5 md:text-sm">
            {tag}
          </li>
        ))}
      </ul>
    </div>
    <span className="sr-only">(abre em nova aba)</span>
  </a>
);

export default ProjectCard;
