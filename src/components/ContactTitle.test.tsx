import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContactTitle from "./ContactTitle";

const TITLE = "Vamos construir algo relevante?";

/** matchMedia controlável: `setMatches()` simula a troca da preferência com a página aberta. */
let mediaListeners: Array<() => void> = [];
let mediaMatches = false;
const setMatches = (matches: boolean) => {
  mediaMatches = matches;
  act(() => mediaListeners.forEach((listener) => listener()));
};

function mockMedia(matches: boolean) {
  mediaMatches = matches;
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return mediaMatches;
        },
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_type: string, listener: () => void) => mediaListeners.push(listener),
        removeEventListener: (_type: string, listener: () => void) => {
          mediaListeners = mediaListeners.filter((item) => item !== listener);
        },
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );
}

/** jsdom não tem PointerEvent: um MouseEvent com `pointerType` cumpre o mesmo papel. */
function pointer(type: string, target: Element, init: { clientX?: number; clientY?: number; pointerType?: string } = {}) {
  const event = new MouseEvent(type, { bubbles: true, clientX: init.clientX ?? 0, clientY: init.clientY ?? 0 });
  Object.defineProperty(event, "pointerType", { value: init.pointerType ?? "mouse" });
  fireEvent(target, event);
}

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

/** IntersectionObserver controlável: `intersect()` simula a entrada ou saída da tela. */
let observerCallback: IntersectionObserverCallback | null = null;
const disconnect = vi.fn();
const intersect = (isIntersecting: boolean) =>
  act(() => observerCallback?.([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver));

beforeEach(() => {
  frames = [];
  clock = 0;
  mediaListeners = [];
  observerCallback = null;
  disconnect.mockClear();
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect = disconnect;
      takeRecords() {
        return [];
      }
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const title = () => screen.getByRole("heading", { level: 2 });

describe("ContactTitle", () => {
  it("é um único h2 com o texto lido uma vez e cópias decorativas ocultas", () => {
    mockMedia(false);
    render(<ContactTitle />);
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(title()).toHaveAccessibleName(TITLE);
    expect(title()).toHaveAttribute("id", "contact-title");
    const decorative = title().querySelectorAll('[aria-hidden="true"]');
    expect(decorative).toHaveLength(2);
    decorative.forEach((layer) => expect(layer).toHaveTextContent(TITLE));
  });

  it("dispara a entrada ao entrar na tela, uma única vez", () => {
    mockMedia(false);
    render(<ContactTitle />);
    expect(title()).not.toHaveAttribute("data-drawn");
    intersect(false);
    expect(title()).not.toHaveAttribute("data-drawn");
    intersect(true);
    expect(title()).toHaveAttribute("data-drawn", "true");
    expect(disconnect).toHaveBeenCalled();
    intersect(false);
    expect(title()).toHaveAttribute("data-drawn", "true");
  });

  it("com mouse e hover fino, o brilho segue o ponteiro e apaga ao sair", () => {
    mockMedia(true);
    render(<ContactTitle />);
    const heading = title();
    vi.spyOn(heading, "getBoundingClientRect").mockReturnValue({ left: 100, top: 50, width: 800, height: 300 } as DOMRect);

    pointer("pointermove", heading, { clientX: 300, clientY: 150 });
    expect(heading).toHaveAttribute("data-glow", "true");
    flushFrames();
    expect(heading.style.getPropertyValue("--gx")).toBe("200.0px");
    expect(heading.style.getPropertyValue("--gy")).toBe("100.0px");

    pointer("pointermove", heading, { clientX: 700, clientY: 250 });
    flushFrames(1);
    const midX = parseFloat(heading.style.getPropertyValue("--gx"));
    expect(midX).toBeGreaterThan(200);
    expect(midX).toBeLessThan(600);
    flushFrames();
    expect(heading.style.getPropertyValue("--gx")).toBe("600.0px");

    pointer("pointerleave", heading);
    expect(heading).toHaveAttribute("data-glow", "false");
  });

  it("no toque, não acende o brilho", () => {
    mockMedia(true);
    render(<ContactTitle />);
    pointer("pointermove", title(), { clientX: 300, clientY: 150, pointerType: "touch" });
    expect(title()).not.toHaveAttribute("data-glow", "true");
  });

  it("ao pedir menos movimento com a página aberta, o brilho apaga e o ponteiro deixa de ser seguido", () => {
    mockMedia(true);
    render(<ContactTitle />);
    pointer("pointermove", title(), { clientX: 300, clientY: 150 });
    flushFrames();
    expect(title()).toHaveAttribute("data-glow", "true");

    setMatches(false);
    expect(title()).not.toHaveAttribute("data-glow");
    expect(title().style.getPropertyValue("--gx")).toBe("");
    pointer("pointermove", title(), { clientX: 320, clientY: 160 });
    expect(title()).not.toHaveAttribute("data-glow");

    setMatches(true);
    pointer("pointermove", title(), { clientX: 320, clientY: 160 });
    expect(title()).toHaveAttribute("data-glow", "true");
  });

  it("ao desmontar, solta o ponteiro, a preferência e o observador", () => {
    mockMedia(true);
    const { unmount } = render(<ContactTitle />);
    const heading = title();
    const removed = vi.spyOn(heading, "removeEventListener");
    unmount();
    expect(removed).toHaveBeenCalledWith("pointermove", expect.any(Function));
    expect(removed).toHaveBeenCalledWith("pointerleave", expect.any(Function));
    expect(mediaListeners).toHaveLength(0);
    expect(disconnect).toHaveBeenCalled();
  });

  it("sem hover fino ou com movimento reduzido, o ponteiro não acende o brilho", () => {
    mockMedia(false);
    render(<ContactTitle />);
    pointer("pointermove", title(), { clientX: 300, clientY: 150 });
    expect(title()).not.toHaveAttribute("data-glow", "true");
    expect(title().style.getPropertyValue("--gx")).toBe("");
  });
});
