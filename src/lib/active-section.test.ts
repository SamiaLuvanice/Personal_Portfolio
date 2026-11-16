import { describe, expect, it } from "vitest";
import { pickActiveSection } from "./active-section";

const sections = [
  { id: "inicio", top: -900, bottom: 0 },
  { id: "projects", top: 0, bottom: 1500 },
  { id: "expertise", top: 1500, bottom: 2800 },
  { id: "contact", top: 2800, bottom: 3400 },
];

describe("pickActiveSection", () => {
  it("escolhe a seção que cruza a linha de leitura logo abaixo da barra", () => {
    expect(pickActiveSection(sections, { probe: 100, atPageEnd: false })).toBe("projects");
  });

  it("muda quando a próxima seção alcança a linha de leitura", () => {
    const shifted = sections.map((section) => ({ ...section, top: section.top - 1450, bottom: section.bottom - 1450 }));
    expect(pickActiveSection(shifted, { probe: 100, atPageEnd: false })).toBe("expertise");
  });

  it("indica a última seção quando a página chegou ao fim", () => {
    expect(pickActiveSection(sections, { probe: 100, atPageEnd: true })).toBe("contact");
  });

  it("não indica nada enquanto o hero ocupa a linha de leitura", () => {
    const atTop = sections.slice(1).map((section) => ({ ...section, top: section.top + 900, bottom: section.bottom + 900 }));
    expect(pickActiveSection(atTop, { probe: 300, atPageEnd: false })).toBeNull();
  });

  it("não indica nada sem seções medidas", () => {
    expect(pickActiveSection([], { probe: 100, atPageEnd: false })).toBeNull();
  });
});
