import { afterEach, describe, expect, it, vi } from "vitest";
import { submitContactForm } from "./contactService";

const payload = { name: "Ana", email: "ana@example.com", message: "Oi" };

function mockFetch(impl: () => Promise<Response>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("submitContactForm", () => {
  it("envia POST JSON para /api/contact e resolve com sucesso", async () => {
    const fetchMock = mockFetch(async () => Response.json({ ok: true }));
    await expect(submitContactForm(payload)).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST", body: JSON.stringify(payload) }));
  });

  it("rejeita com a mensagem da API em erro HTTP", async () => {
    mockFetch(async () => Response.json({ error: "Dados inválidos" }, { status: 400 }));
    await expect(submitContactForm(payload)).rejects.toThrow("Dados inválidos");
  });

  it("rejeita com mensagem padrão quando o erro não é JSON", async () => {
    mockFetch(async () => new Response("<html>502</html>", { status: 502 }));
    await expect(submitContactForm(payload)).rejects.toThrow("Falha ao enviar o formulário de contato (HTTP 502)");
  });

  it("rejeita quando a resposta de sucesso não confirma o envio", async () => {
    mockFetch(async () => Response.json({ unexpected: true }));
    await expect(submitContactForm(payload)).rejects.toThrow("Resposta inesperada");
  });

  it("propaga falha de rede", async () => {
    mockFetch(async () => {
      throw new TypeError("Failed to fetch");
    });
    await expect(submitContactForm(payload)).rejects.toThrow("Failed to fetch");
  });
});
