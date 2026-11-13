import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL, buildMailtoHref } from "./contact";

describe("buildMailtoHref", () => {
  it("monta o mailto com assunto e corpo codificados", () => {
    const href = buildMailtoHref({ subject: "Olá & tchau", body: "Linha 1\nLinha 2" });
    expect(href).toBe(`mailto:${CONTACT_EMAIL}?subject=Ol%C3%A1%20%26%20tchau&body=Linha%201%0ALinha%202`);
  });

  it("decodifica de volta para o texto original", () => {
    const url = new URL(buildMailtoHref({ subject: "Contato pelo portfólio", body: "Olá, Sâmia!" }));
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe(CONTACT_EMAIL);
    expect(url.searchParams.get("subject")).toBe("Contato pelo portfólio");
    expect(url.searchParams.get("body")).toBe("Olá, Sâmia!");
  });

  it("usa o assunto e o corpo padrão do portfólio", () => {
    const url = new URL(buildMailtoHref());
    expect(url.searchParams.get("subject")).toBe("Contato pelo portfólio");
    expect(url.searchParams.get("body")).toContain("gostaria de falar sobre uma oportunidade");
  });
});
