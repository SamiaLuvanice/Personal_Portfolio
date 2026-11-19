import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Projects from "./Projects";

const cardNames = () =>
  within(screen.getByRole("list", { name: "Projetos" }))
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"));

describe("Projetos", () => {
  it("mostra os quatro projetos como links que abrem em nova aba", () => {
    render(<Projects />);
    const links = within(screen.getByRole("list", { name: "Projetos" })).getAllByRole("link");
    expect(links).toHaveLength(4);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
    expect(screen.getByRole("link", { name: /BestPrice IA — Monitor de preços com IA/ })).toHaveAttribute("href", "https://bestprice-stage.pages.dev/");
    expect(screen.getByRole("link", { name: /Lopes Tech — Software sob medida/ })).toHaveAttribute("href", "https://lopestech.abeesys.com/");
  });

  it("filtra autorais e comerciais e anuncia o resultado", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const todos = screen.getByRole("button", { name: "Todos" });
    expect(todos).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Autorais" }));
    expect(cardNames()).toEqual(["https://bestprice-stage.pages.dev/", "https://studynice.vercel.app/"]);
    expect(screen.getByRole("button", { name: "Autorais" })).toHaveAttribute("aria-pressed", "true");
    expect(todos).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("2 projetos autorais");

    await user.click(screen.getByRole("button", { name: "Comerciais" }));
    expect(cardNames()).toEqual(["https://www.soundhouse.com.br/", "https://lopestech.abeesys.com/"]);
    expect(screen.getByRole("status")).toHaveTextContent("2 projetos comerciais");

    await user.click(todos);
    expect(cardNames()).toHaveLength(4);
  });

  it("cada card mostra categoria, título e duas tags, sem descrição longa", () => {
    render(<Projects />);
    const card = screen.getByRole("link", { name: /StudyNice/ });
    expect(within(card).getByText("Autoral")).toBeInTheDocument();
    expect(within(card).getByText("Web App")).toBeInTheDocument();
    expect(within(card).getByText("Full Stack")).toBeInTheDocument();
    expect(within(card).getByRole("img")).toHaveAttribute("alt", expect.stringMatching(/StudyNice/));
    expect(card.querySelector("p")).toBeNull();
    expect(card).toHaveAccessibleName(expect.stringContaining("StudyNice — Hábitos de estudo"));
    expect(card).toHaveAccessibleName(expect.stringContaining("(abre em nova aba)"));
  });

  it("anima o nome letra a letra sem soletrá-lo para o leitor de tela", () => {
    render(<Projects />);
    const card = screen.getByRole("link", { name: /StudyNice/ });
    const heading = within(card).getByRole("heading", { level: 3 });
    expect(heading).toHaveAccessibleName("StudyNice — Hábitos de estudo");

    const rolling = heading.querySelector("[aria-hidden='true']");
    expect(rolling).not.toBeNull();
    expect(rolling!.querySelectorAll(".roll-letter")).toHaveLength("StudyNice".length);
    expect(within(card).getByText("Hábitos de estudo")).toHaveAttribute("aria-hidden", "true");
  });

  it("oferece o link para os repositórios no GitHub", () => {
    render(<Projects />);
    expect(screen.getByRole("link", { name: /Mais no GitHub/ })).toHaveAttribute("href", "https://github.com/SamiaLuvanice");
  });
});
