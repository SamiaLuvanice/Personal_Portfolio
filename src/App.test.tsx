import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const visit = (path: string) => window.history.replaceState(null, "", path);

describe("App", () => {
  afterEach(() => {
    visit("/");
    vi.restoreAllMocks();
  });

  it("mostra o portfólio na raiz", () => {
    visit("/");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /Sâmia\s+Luvanice/ })).toBeInTheDocument();
    expect(screen.queryByText("Página não encontrada.")).not.toBeInTheDocument();
  });

  it("mostra a página não encontrada num endereço inexistente, com link de volta", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    visit("/nao-existe");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.getByText("Página não encontrada.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "/");
    expect(console.error).toHaveBeenCalledWith(expect.any(String), "/nao-existe");
  });
});
