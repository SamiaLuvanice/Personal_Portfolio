import { Fragment, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/content/portfolio";

const CATEGORY_LABEL = { autoral: "Autoral", comercial: "Comercial" } as const;
// O laranja fica reservado às ações; as categorias usam magenta e ciano.
const CATEGORY_DOT = { autoral: "bg-accent", comercial: "bg-[hsl(var(--tertiary))]" } as const;

/** Complemento do título depois do travessão ("Nome — complemento"). */
const taglineOf = (project: Project) => project.title.slice(project.name.length).replace(/^\s*—\s*/, "");

/**
 * Nome que "rola" letra a letra no hover/foco: cada letra tem duas cópias empilhadas e sobe meia
 * altura, com atraso escalonado (`--i`). Só CSS `transform`, sem biblioteca de animação.
 * Fica oculto do leitor de tela, que lê o título completo em texto corrido.
 */
const RollingText = ({ text }: { text: string }) => {
  let index = 0;
  return (
    <span aria-hidden="true" className="block select-none">
      {text.split(" ").map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {wordIndex > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {[...word].map((letter) => {
              const i = index++;
              return (
                <span key={i} className="roll-letter inline-block h-[1.2em] overflow-hidden align-bottom">
                  <span className="roll-letter-track flex flex-col leading-[1.2]" style={{ "--i": i } as CSSProperties}>
                    <span>{letter}</span>
                    <span>{letter}</span>
                  </span>
                </span>
              );
            })}
          </span>
        </Fragment>
      ))}
    </span>
  );
};

/** Card inteiro clicável: imagem de fundo, categoria, nome animado, complemento e duas tags. */
// O nome acessível vem do conteúdo visível (WCAG 2.5.3): imagem, categoria, título, tags e aviso.
const ProjectCard = ({ project }: { project: Project }) => (
  <a
    href={project.url}
    target="_blank"
    rel="noopener noreferrer"
    className="project-card group relative isolate block overflow-hidden rounded-[1.25rem] bg-[hsl(var(--surface-dark))] md:rounded-3xl"
  >
    <img
      src={project.image.src}
      alt={project.image.alt}
      width={1200}
      height={750}
      loading="lazy"
      decoding="async"
      className="project-card-image absolute inset-0 h-full w-full object-cover object-top"
    />
    {/* Degradê escuro sob o texto para manter contraste AA sobre qualquer screenshot. */}
    <span
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark)/0.95)] via-[hsl(var(--surface-dark)/0.7)] via-45% to-transparent to-75%"
    />

    <div className="relative z-10 flex aspect-[4/3] flex-col justify-between p-4 text-white md:aspect-[16/11] md:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-display text-xs font-medium uppercase tracking-[0.08em] text-foreground">
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${CATEGORY_DOT[project.category]}`} />
          {CATEGORY_LABEL[project.category]}
        </span>
        <span
          aria-hidden="true"
          className="project-card-open inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[hsl(var(--surface-dark))]"
        >
          <ArrowRight className="project-card-arrow h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-col gap-2 md:gap-3">
        <div>
          <h3 className="font-display text-2xl font-semibold leading-[1.2] md:text-[2rem]">
            <span className="sr-only">{project.title}</span>
            <RollingText text={project.name} />
          </h3>
          <span aria-hidden="true" className="mt-1 block text-sm md:text-base">
            {taglineOf(project)}
          </span>
        </div>
        <ul aria-label="Tags" className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-white/30 px-3 py-1 text-xs font-medium md:text-sm">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <span className="sr-only">(abre em nova aba)</span>
  </a>
);

export default ProjectCard;
