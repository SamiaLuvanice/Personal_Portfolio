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
    // Cards fora de foco do carrossel de certificados são esmaecidos por design
    // (dívida registrada em docs/LEARNINGS.md); o card ativo continua verificado.
    .exclude("[data-inactive]")
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

test("formulário de contato envia e confirma o sucesso", async ({ page }) => {
  let received: unknown;
  await page.route("**/api/contact", async (route) => {
    received = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/#contact");
  await page.getByRole("textbox", { name: "Seu nome" }).fill("Ana");
  await page.getByRole("textbox", { name: "Seu email" }).fill("ana@example.com");
  await page.getByRole("textbox", { name: "Sua mensagem" }).fill("Olá!");
  await page.getByRole("button", { name: /enviar mensagem/i }).click();
  await expect(page.getByText(/mensagem enviada com sucesso/i)).toBeVisible();
  expect(received).toEqual({ name: "Ana", email: "ana@example.com", message: "Olá!" });
});

test("formulário de contato informa falha do servidor", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.fulfill({ status: 500, json: { error: "Erro" } }));
  await page.goto("/#contact");
  await page.getByRole("textbox", { name: "Seu nome" }).fill("Ana");
  await page.getByRole("textbox", { name: "Seu email" }).fill("ana@example.com");
  await page.getByRole("textbox", { name: "Sua mensagem" }).fill("Olá!");
  await page.getByRole("button", { name: /enviar mensagem/i }).click();
  await expect(page.getByText(/não foi possível enviar/i)).toBeVisible();
});

test("rota desconhecida mostra a página 404", async ({ page }) => {
  await page.goto("/rota-que-nao-existe");
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});
