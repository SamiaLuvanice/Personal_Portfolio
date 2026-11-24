import { useEffect, useState } from "react";
import { pickActiveSection } from "@/lib/active-section";

/** Linha de leitura a 35% da altura da janela, no desktop e no celular. */
const PROBE_RATIO = 0.35;

/** Liga a regra pura de seção ativa à rolagem e às mudanças de tamanho da página. */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const sectionIds = key.split(",");
    let frame = 0;

    const measure = () => {
      frame = 0;
      const probe = window.innerHeight * PROBE_RATIO;
      const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const bounds = sectionIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return { id: element.id, top: rect.top, bottom: rect.bottom };
        });
      setActive(pickActiveSection(bounds, { probe, atPageEnd }));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    // Remede quando a altura da página muda (imagens, accordion, fontes).
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resizeObserver?.observe(document.body);

    // Primeira medida no próximo quadro: medir já, na montagem, forçaria o layout dentro da mesma
    // tarefa da renderização inicial (spec 0009).
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}
