import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CopyEmailButton from "./CopyEmailButton";

const EMAIL = "samia.luvanice.dev@gmail.com";

function mockClipboard(writeText: ((text: string) => Promise<void>) | undefined) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  });
}

/** Resolve a promessa da cópia e as atualizações de estado que vêm dela. */
async function clickCopy() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Copiar e-mail" }));
  });
}

afterEach(() => {
  vi.useRealTimers();
  mockClipboard(undefined);
});

describe("CopyEmailButton", () => {
  it("mostra o endereço e o controle acessível de copiar", () => {
    render(<CopyEmailButton email={EMAIL} />);
    expect(screen.getByText(EMAIL)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copiar e-mail" })).toHaveTextContent("Copiar");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("copia o endereço, confirma e anuncia; volta a 'Copiar' depois de 2 s", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<CopyEmailButton email={EMAIL} />);

    await clickCopy();

    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(screen.getByRole("button", { name: "Copiar e-mail" })).toHaveTextContent("Copiado");
    expect(screen.getByRole("status")).toHaveTextContent("E-mail copiado");

    act(() => vi.advanceTimersByTime(2000));

    expect(screen.getByRole("button", { name: "Copiar e-mail" })).toHaveTextContent("Copiar");
    expect(screen.getByRole("button", { name: "Copiar e-mail" })).not.toHaveTextContent("Copiado");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it.each([
    ["recusa a cópia", () => mockClipboard(vi.fn().mockRejectedValue(new Error("negado")))],
    ["não oferece a área de transferência", () => mockClipboard(undefined)],
  ])("quando o navegador %s, avisa para copiar manualmente e seleciona o endereço", async (_caso, setup) => {
    setup();
    render(<CopyEmailButton email={EMAIL} />);

    await clickCopy();

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Não foi possível copiar. Copie o endereço manualmente.");
    expect(status).not.toHaveClass("sr-only");
    expect(screen.getByRole("button", { name: "Copiar e-mail" })).toHaveTextContent("Copiar");
    expect(window.getSelection()?.toString()).toBe(EMAIL);
  });

  it("um novo clique reinicia a contagem de 2 s", async () => {
    vi.useFakeTimers();
    mockClipboard(vi.fn().mockResolvedValue(undefined));
    render(<CopyEmailButton email={EMAIL} />);

    await clickCopy();
    act(() => vi.advanceTimersByTime(1500));
    await clickCopy();
    act(() => vi.advanceTimersByTime(1500));

    expect(screen.getByRole("button", { name: "Copiar e-mail" })).toHaveTextContent("Copiado");
  });

  it("não deixa timer pendente ao sair da tela", async () => {
    vi.useFakeTimers();
    mockClipboard(vi.fn().mockResolvedValue(undefined));
    const { unmount } = render(<CopyEmailButton email={EMAIL} />);

    await clickCopy();
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
