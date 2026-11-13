import { describe, expect, it, vi } from "vitest";
import { buildEmailHtml, escapeHtml, handleContact, type ContactDeps } from "./contact";

const valid = { name: "Ana", email: "ana@example.com", message: "Olá!\nVamos conversar?" };

function deps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    sendEmail: vi.fn().mockResolvedValue(undefined),
    logError: vi.fn(),
    ...overrides,
  };
}

describe("escapeHtml", () => {
  it("neutraliza marcação enviada pelo visitante", () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">&`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;",
    );
  });
});

describe("buildEmailHtml", () => {
  it("escapa os campos e preserva quebras de linha da mensagem", () => {
    const html = buildEmailHtml({ name: "<b>Ana</b>", email: "ana@example.com", message: "a\n<script>" });
    expect(html).toContain("&lt;b&gt;Ana&lt;/b&gt;");
    expect(html).toContain("a<br />&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});

describe("handleContact", () => {
  it("envia o e-mail e responde 200 com payload válido", async () => {
    const d = deps();
    const result = await handleContact("POST", valid, d);
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(d.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ replyTo: valid.email, subject: "Novo contato - Ana" }));
  });

  it("aceita corpo JSON em texto e remove espaços das pontas", async () => {
    const d = deps();
    const result = await handleContact("POST", JSON.stringify({ ...valid, name: "  Ana  " }), d);
    expect(result.status).toBe(200);
    expect(d.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ subject: "Novo contato - Ana" }));
  });

  it.each([
    ["sem campos", {}],
    ["e-mail inválido", { ...valid, email: "não-é-email" }],
    ["mensagem vazia", { ...valid, message: "   " }],
    ["mensagem longa demais", { ...valid, message: "x".repeat(5001) }],
    ["JSON malformado", "{"],
  ])("responde 400 para %s sem enviar e-mail", async (_case, body) => {
    const d = deps();
    const result = await handleContact("POST", body, d);
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({ error: "Dados inválidos" });
    expect(d.sendEmail).not.toHaveBeenCalled();
  });

  it("responde 405 para método diferente de POST", async () => {
    const result = await handleContact("GET", undefined, deps());
    expect(result).toEqual({ status: 405, body: { error: "Método não permitido" } });
  });

  it("responde 500 genérico quando o provedor falha, sem vazar o detalhe", async () => {
    const d = deps({ sendEmail: vi.fn().mockRejectedValue(new Error("invalid api key")) });
    const result = await handleContact("POST", valid, d);
    expect(result).toEqual({ status: 500, body: { error: "Não foi possível enviar a mensagem" } });
    expect(JSON.stringify(result.body)).not.toContain("api key");
    expect(d.logError).toHaveBeenCalledWith("Falha ao enviar e-mail de contato", expect.any(Error));
  });

  it("descarta em silêncio envio de robô que preenche o honeypot", async () => {
    const d = deps();
    const result = await handleContact("POST", { ...valid, website: "https://spam.example" }, d);
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(d.sendEmail).not.toHaveBeenCalled();
  });
});
