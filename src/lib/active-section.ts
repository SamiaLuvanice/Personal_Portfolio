export interface SectionBounds {
  id: string;
  /** Posição do topo e da base relativa à viewport, em px. */
  top: number;
  bottom: number;
}

/**
 * Seção ativa: a que cruza a linha de leitura (`probe`, logo abaixo da barra fixa).
 * No fim da página, a última seção vence, porque uma seção curta no fim nunca alcança a linha.
 */
export function pickActiveSection(sections: SectionBounds[], { probe, atPageEnd }: { probe: number; atPageEnd: boolean }): string | null {
  if (sections.length === 0) return null;
  if (atPageEnd) return sections[sections.length - 1].id;
  const current = sections.find((section) => section.top <= probe && section.bottom > probe);
  return current ? current.id : null;
}
