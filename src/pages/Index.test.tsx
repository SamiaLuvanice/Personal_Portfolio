import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Index from "./Index";

// As esperas pela montagem escalonada chegam a 5 s; o teste precisa de folga acima disso sob carga.
vi.setConfig({ testTimeout: 15_000 });

const SECTION_TITLES = ["projects-title", "expertise-title", "experience-title", "contact-title"];
const mountedSections = () => SECTION_TITLES.filter((id) => document.getElementById(id));
const allSectionsMounted = () => expect(mountedSections()).toEqual(SECTION_TITLES);
const SECTION_MODULES = [
  () => import("@/components/Projects"),
  () => import("@/components/Expertise"),
  () => import("@/components/Experience"),
  () => import("@/components/Contact"),
];

/** Momento ocioso que nunca chega: só a âncora pode montar as seções seguintes. */
function stubIdleNever() {
  const request = vi.fn(() => 1);
  const cancel = vi.fn();
  vi.stubGlobal("requestIdleCallback", request);
  vi.stubGlobal("cancelIdleCallback", cancel);
  return { request, cancel };
}

describe("Index", () => {
  afterEach(() => {
    cleanup(); // desmonta antes de desfazer os stubs que a desmontagem usa
    window.history.replaceState(null, "", "/");
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("monta as seções abaixo da dobra sem interação, uma por vez", async () => {
    // Módulos já carregados: sem escalonamento, as quatro seções entrariam num mesmo commit.
    await Promise.all(SECTION_MODULES.map((load) => load()));
    const counts: number[] = [];
    const observer = new MutationObserver(() => counts.push(mountedSections().length));
    observer.observe(document.body, { childList: true, subtree: true });

    render(<Index />);
    await waitFor(allSectionsMounted, { timeout: 5000 });
    observer.disconnect();

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    const steps = counts.map((count, i) => count - (counts[i - 1] ?? 0));
    expect(Math.max(...steps)).toBe(1);
  });

  it("espera um momento ocioso (com prazo) antes de montar a próxima seção", async () => {
    const { request } = stubIdleNever();
    render(<Index />);
    await waitFor(() => expect(mountedSections()).toEqual(["projects-title"]));
    expect(request).toHaveBeenCalledWith(expect.any(Function), { timeout: 300 });
    // Sem momento ocioso, nada além da primeira seção.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(mountedSections()).toEqual(["projects-title"]);
  });

  it("com uma âncora no endereço, monta todas as seções sem esperar", async () => {
    stubIdleNever();
    window.history.replaceState(null, "", "/#contact");
    render(<Index />);
    await waitFor(allSectionsMounted);
  });

  it("ao seguir uma âncora durante a montagem, monta as seções restantes", async () => {
    stubIdleNever();
    render(<Index />);
    await waitFor(() => expect(mountedSections()).toEqual(["projects-title"]));
    act(() => {
      window.history.replaceState(null, "", "/#contact");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    await waitFor(allSectionsMounted);
  });

  it.each(["reload", "back_forward"])(
    "ao recarregar ou voltar no histórico (%s), monta todas as seções para o navegador restaurar a rolagem",
    async (type) => {
      stubIdleNever();
      vi.spyOn(performance, "getEntriesByType").mockReturnValue([{ type } as PerformanceNavigationTiming]);
      render(<Index />);
      await waitFor(allSectionsMounted);
    },
  );

  it("ao desmontar, cancela a montagem agendada", async () => {
    const { cancel } = stubIdleNever();
    const { unmount } = render(<Index />);
    await waitFor(() => expect(mountedSections()).toEqual(["projects-title"]));
    unmount();
    expect(cancel).toHaveBeenCalled();
  });
});
