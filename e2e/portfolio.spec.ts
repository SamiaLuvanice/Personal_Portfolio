import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// A API do GitHub é externa: o teste não depende dela nem da rede.
async function stubExternal(page: Page) {
  await page.route("https://api.github.com/**", (route) => route.fulfill({ json: [] }));
}

// Rola a página inteira para disparar as animações de entrada e espera assentarem;
// axe mediria contraste no meio do fade e acusaria falsos positivos.
async function revealWholePage(page: Page) {
  for (let step = 0; step < 25; step += 1) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(1500);
}

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`);
}

test.beforeEach(async ({ page }) => {
  await stubExternal(page);
});

test("home carrega com título, um h1, seções e metadados de SEO", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Sâmia Luvanice/);
  await expect(page.locator("h1")).toHaveCount(1);
  for (const id of ["about", "projects", "certificates", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\//);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
});

test("home não tem violações de acessibilidade sérias ou críticas", async ({ page }) => {
  await page.goto("/");
  await revealWholePage(page);
  expect(await seriousViolations(page)).toEqual([]);
});

test("contato oferece e-mail com assunto preenchido", async ({ page }) => {
  await page.goto("/#contact");
  const email = page.locator("#contact").getByRole("link", { name: /samia\.luvanice\.dev@gmail\.com/ });
  await expect(email).toBeVisible();
  await expect(email).toHaveAttribute("href", /^mailto:samia\.luvanice\.dev@gmail\.com\?subject=.+/);
});

test("rota desconhecida mostra a página 404", async ({ page }) => {
  await page.goto("/rota-que-nao-existe");
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});
