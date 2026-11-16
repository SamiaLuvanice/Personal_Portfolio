import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Expertise from "./Expertise";

const trigger = (name: string) => screen.getByRole("button", { name: new RegExp(name) });

describe("Expertise", () => {
  it("lista as cinco áreas com a primeira aberta", () => {
    render(<Expertise />);
    expect(trigger("Frontend")).toHaveAttribute("aria-expanded", "true");
    for (const name of ["Backend", "Arquitetura & Integrações", "DevOps & Workflow", "IA no fluxo de engenharia"]) {
      expect(trigger(name)).toHaveAttribute("aria-expanded", "false");
    }
    expect(screen.getByRole("list", { name: "Tecnologias de Frontend" })).toHaveTextContent("React");
  });

  it("abre vários itens ao mesmo tempo por clique", async () => {
    const user = userEvent.setup();
    render(<Expertise />);
    await user.click(trigger("Backend"));
    expect(trigger("Backend")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Frontend")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("list", { name: "Tecnologias de Backend" })).toHaveTextContent("FastAPI");
  });

  it("abre e fecha pelo teclado com Enter e Espaço", async () => {
    const user = userEvent.setup();
    render(<Expertise />);
    trigger("DevOps").focus();
    await user.keyboard("{Enter}");
    expect(trigger("DevOps")).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(trigger("DevOps")).toHaveAttribute("aria-expanded", "false");
  });
});
