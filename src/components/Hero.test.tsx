import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Hero from "./Hero";

function mockPointerMedia(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
}

/** jsdom não tem PointerEvent: um MouseEvent com `pointerType` cumpre o mesmo papel. */
function pointer(type: string, target: Element, init: { clientX?: number; clientY?: number; pointerType?: string } = {}) {
  const event = new MouseEvent(type, { bubbles: true, clientX: init.clientX ?? 0, clientY: init.clientY ?? 0 });
  Object.defineProperty(event, "pointerType", { value: init.pointerType ?? "mouse" });
  fireEvent(target, event);
}

/** Relógio simulado: cada quadro avança 1/60 s, sem depender do relógio real. */
let frames: FrameRequestCallback[] = [];
let clock = 0;
const flushFrames = (count = 120) => {
  act(() => {
    for (let i = 0; i < count && frames.length; i++) {
      const pending = frames;
      frames = [];
      clock += 1000 / 60;
      pending.forEach((callback) => callback(clock));
    }
  });
};

beforeEach(() => {
  frames = [];
  clock = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

const heroSection = () => screen.getByRole("region", { name: "Sâmia Luvanice" });

describe("Hero", () => {
  it("mostra o nome como h1, a apresentação e as duas ações", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName("Sâmia Luvanice");
    expect(screen.getByText("Full Stack Developer")).toBeInTheDocument();
    expect(screen.getByText(/Transformo ideias em aplicações web completas/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explorar projetos" })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: "Entrar em contato" })).toHaveAttribute("href", "#contact");
  });

  it("mostra os links profissionais como ícones com nome acessível e destino atual", () => {
    render(<Hero />);
    const links = within(screen.getByRole("list", { name: "Links profissionais" }));
    expect(links.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/SamiaLuvanice");
    expect(links.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/samialuvanice/");
    expect(links.getByRole("link", { name: "Currículo (PDF)" })).toHaveAttribute("href", "/curriculo.pdf");
    expect(links.getByRole("link", { name: "E-mail" })).toHaveAttribute("href", expect.stringMatching(/^mailto:/));
    for (const name of ["GitHub", "LinkedIn", "Currículo (PDF)"]) {
      expect(links.getByRole("link", { name })).toHaveAttribute("target", "_blank");
    }
  });

  it("expõe só o retrato principal e esconde as camadas decorativas", () => {
    const { container } = render(<Hero />);
    const portrait = screen.getByRole("img", { name: /Retrato de Sâmia Luvanice/ });
    expect(portrait).toHaveAttribute("src", "/hero/portrait-2026.webp");
    expect(portrait).toHaveAttribute("fetchpriority", "high");
    expect(portrait).not.toHaveAttribute("loading", "lazy");
    expect(screen.getAllByRole("img")).toHaveLength(1);

    const sources = [...container.querySelectorAll("img")].map((img) => img.getAttribute("src"));
    expect(new Set(sources)).toEqual(new Set(["/hero/portrait-2026.webp"]));
    const aurora = container.querySelector("[data-hero-aurora]");
    expect(aurora).toHaveAttribute("aria-hidden", "true");
  });

  it("com mouse, revela a cor e leva o centro até o ponteiro; ao sair, apaga", () => {
    mockPointerMedia(true);
    render(<Hero />);
    const section = heroSection();
    expect(section).toHaveAttribute("data-reveal", "false");

    pointer("pointermove", section, { clientX: 600, clientY: 300 });
    flushFrames();
    expect(section).toHaveAttribute("data-reveal", "true");
    expect(parseFloat(section.style.getPropertyValue("--mx"))).toBeCloseTo(600, 0);
    expect(parseFloat(section.style.getPropertyValue("--my"))).toBeCloseTo(300, 0);

    pointer("pointerleave", section);
    expect(section).toHaveAttribute("data-reveal", "false");
  });

  it("segue o ponteiro com atraso suave e assenta em menos de 1 s", () => {
    mockPointerMedia(true);
    render(<Hero />);
    const section = heroSection();
    const mx = () => parseFloat(section.style.getPropertyValue("--mx"));

    pointer("pointermove", section, { clientX: 100, clientY: 100 });
    flushFrames();
    expect(mx()).toBeCloseTo(100, 0);

    pointer("pointermove", section, { clientX: 700, clientY: 100 });
    flushFrames(1);
    expect(mx()).toBeGreaterThan(100);
    expect(mx()).toBeLessThan(700);

    flushFrames(59);
    expect(Math.abs(mx() - 700)).toBeLessThan(1);
  });

  it("ignora o toque e, sem hover fino ou com movimento reduzido, não segue o ponteiro", () => {
    mockPointerMedia(true);
    const { unmount } = render(<Hero />);
    pointer("pointermove", heroSection(), { clientX: 100, clientY: 100, pointerType: "touch" });
    flushFrames();
    expect(heroSection()).toHaveAttribute("data-reveal", "false");
    unmount();

    mockPointerMedia(false);
    render(<Hero />);
    pointer("pointermove", heroSection(), { clientX: 100, clientY: 100 });
    flushFrames();
    expect(heroSection()).toHaveAttribute("data-reveal", "false");
    expect(heroSection().style.getPropertyValue("--mx")).toBe("");
  });
});
