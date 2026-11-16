import { describe, expect, it } from "vitest";
import { filterProjects } from "./filter-projects";

const projects = [
  { name: "A", category: "autoral" as const },
  { name: "B", category: "comercial" as const },
  { name: "C", category: "autoral" as const },
];

describe("filterProjects", () => {
  it("devolve todos os projetos no filtro 'todos', na ordem original", () => {
    expect(filterProjects(projects, "todos").map((project) => project.name)).toEqual(["A", "B", "C"]);
  });

  it("devolve só os autorais", () => {
    expect(filterProjects(projects, "autoral").map((project) => project.name)).toEqual(["A", "C"]);
  });

  it("devolve só os comerciais", () => {
    expect(filterProjects(projects, "comercial").map((project) => project.name)).toEqual(["B"]);
  });
});
