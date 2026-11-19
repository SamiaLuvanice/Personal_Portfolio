import { describe, expect, it } from "vitest";
import { EXPERIENCE, EXPERTISE, NAV_ITEMS, PROJECTS, SOCIAL_LINKS } from "./portfolio";

describe("conteúdo do portfólio", () => {
  it("tem quatro projetos, dois autorais e dois comerciais, com destino https e duas tags", () => {
    expect(PROJECTS.map((project) => project.name)).toEqual(["BestPrice IA", "StudyNice", "Sound House", "Lopes Tech"]);
    expect(PROJECTS.filter((project) => project.category === "autoral")).toHaveLength(2);
    expect(PROJECTS.filter((project) => project.category === "comercial")).toHaveLength(2);
    for (const project of PROJECTS) {
      expect(new URL(project.url).protocol).toBe("https:");
      expect(project.tags).toHaveLength(2);
      expect(project.image.alt.length).toBeGreaterThan(10);
      // O card anima o nome e mostra o complemento depois do travessão.
      expect(project.title).toMatch(new RegExp(`^${project.name} — \\S`));
    }
  });

  it("tem cinco áreas de expertise, cada uma com tecnologias", () => {
    expect(EXPERTISE.map((item) => item.title)).toEqual([
      "Frontend",
      "Backend",
      "Arquitetura & Integrações",
      "DevOps & Workflow",
      "IA no fluxo de engenharia",
    ]);
    for (const item of EXPERTISE) expect(item.technologies.length).toBeGreaterThan(3);
  });

  it("lista só Sound House (atual) e Governo do Estado do Ceará na experiência", () => {
    expect(EXPERIENCE.map((entry) => entry.company)).toEqual(["Sound House", "Governo do Estado do Ceará"]);
    expect(EXPERIENCE.map((entry) => entry.current)).toEqual([true, false]);
    expect(EXPERIENCE.some((entry) => entry.company.includes("Lopes"))).toBe(false);
  });

  it("deriva as contagens da navegação do tamanho das listas", () => {
    expect(NAV_ITEMS).toEqual([
      { id: "projects", label: "Projetos", count: "04" },
      { id: "expertise", label: "Expertise", count: "05" },
      { id: "experience", label: "Experiência", count: "02" },
      { id: "contact", label: "Contato" },
    ]);
  });

  it("aponta GitHub, LinkedIn, currículo e e-mail para os destinos oficiais", () => {
    expect(SOCIAL_LINKS.github).toBe("https://github.com/SamiaLuvanice");
    expect(SOCIAL_LINKS.linkedin).toBe("https://www.linkedin.com/in/samialuvanice/");
    expect(SOCIAL_LINKS.resume).toBe("/curriculo.pdf");
    expect(SOCIAL_LINKS.email).toMatch(/^mailto:samia\.luvanice\.dev@gmail\.com\?/);
  });
});
