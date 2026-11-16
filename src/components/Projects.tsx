import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import SectionTitle from "@/components/SectionTitle";
import { PROJECTS, SOCIAL_LINKS } from "@/content/portfolio";
import { filterProjects, type ProjectFilter } from "@/lib/filter-projects";
import { cn } from "@/lib/utils";

const FILTERS: { value: ProjectFilter; label: string; announce: string }[] = [
  { value: "todos", label: "Todos", announce: "projetos" },
  { value: "autoral", label: "Autorais", announce: "projetos autorais" },
  { value: "comercial", label: "Comerciais", announce: "projetos comerciais" },
];

const Projects = () => {
  const [filter, setFilter] = useState<ProjectFilter>("todos");
  const visible = filterProjects(PROJECTS, filter);
  const active = FILTERS.find((item) => item.value === filter)!;

  return (
    <section aria-labelledby="projects-title" className="surface-light px-5 py-20 md:px-10 md:py-24 lg:px-20 lg:py-32">
      <div className="mx-auto flex max-w-[80rem] flex-col items-center gap-8 md:gap-12">
        <SectionTitle id="projects-title">PROJETOS</SectionTitle>

        <div role="group" aria-label="Filtrar projetos" className="flex flex-wrap justify-center gap-1">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                "min-h-11 rounded-full px-4 text-[0.9375rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-base",
                filter === item.value ? "font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-8" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p role="status" className="sr-only">
          {visible.length} {active.announce}
        </p>

        <ul aria-label="Projetos" className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          {visible.map((project) => (
            <li key={project.name}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>

        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Mais no GitHub
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

export default Projects;
