export type ProjectFilter = "todos" | "autoral" | "comercial";

/** Filtra preservando a ordem original; "todos" devolve a lista inteira. */
export function filterProjects<T extends { category: "autoral" | "comercial" }>(projects: T[], filter: ProjectFilter): T[] {
  return filter === "todos" ? projects : projects.filter((project) => project.category === filter);
}
