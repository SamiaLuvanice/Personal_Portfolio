/// <reference lib="dom" />

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

test("navegação flutua junto à borda inferior sem cobrir o rodapé", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(nav).toBeVisible();
  const viewport = page.viewportSize()!;
  const initialBox = (await nav.boundingBox())!;
  expect(viewport.height - initialBox.y - initialBox.height).toBeGreaterThan(0);
  expect(viewport.height - initialBox.y).toBeLessThan(100);

  await page.getByRole("contentinfo").getByRole("link", { name: "GitHub" }).scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  expect((await nav.boundingBox())!.y).toBeCloseTo(initialBox.y);
  const footerLink = page.getByRole("contentinfo").getByRole("link", { name: "GitHub" });
  await expect(footerLink).toBeInViewport({ ratio: 1 });
  const footerLinkBox = (await footerLink.boundingBox())!;
  expect(footerLinkBox.y + footerLinkBox.height).toBeLessThan(initialBox.y);
});

test("menu estreito abre para cima, fecha com Escape e navega para a seção", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  const menu = nav.getByRole("button", { name: "Abrir menu" });
  await menu.click({ timeout: 5000 });
  const closeMenu = nav.getByRole("button", { name: "Fechar menu" });
  const projects = nav.getByRole("link", { name: "Projetos" });
  await expect(closeMenu).toHaveAttribute("aria-expanded", "true");
  expect((await projects.boundingBox())!.y).toBeLessThan((await closeMenu.boundingBox())!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);

  await projects.focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(projects).toBeHidden();

  await menu.press("Enter");
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Tecnologias" })).toBeFocused();
  await nav.getByRole("button", { name: "Alternar tema" }).focus();
  await page.keyboard.press("Tab");
  await expect(menu).toHaveAttribute("aria-expanded", "false");

  await menu.focus();
  await menu.press("Enter");
  await projects.press("Enter");
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("monograma usa o degradê do favicon com contraste nos dois temas", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#contact");

  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  const home = nav.getByRole("link", { name: "SL, início" });
  const monogram = home.getByText("SL", { exact: true });
  const themeToggle = nav.getByRole("button", { name: "Alternar tema" });
  const pink = [236, 72, 153];
  const blue = [59, 130, 246];
  const luminance = (rgb: number[]) => rgb
    .map((value) => value / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, channel) => sum + value * [0.2126, 0.7152, 0.0722][channel], 0);

  async function checkGradient() {
    await expect(monogram).toHaveCSS(
      "background-image",
      /^linear-gradient\(to right bottom, rgb\(236, 72, 153\), rgb\(59, 130, 246\)\)$/,
    );
    await expect(monogram).toHaveCSS("background-clip", "text");
    const background = await home.evaluate((link) => getComputedStyle(link).backgroundColor);
    const match = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(background);
    expect(match, "a superfície da marca é opaca").not.toBeNull();
    const backgroundLuminance = luminance(match!.slice(1).map(Number));
    for (let percent = 0; percent <= 100; percent += 1) {
      const color = pink.map((value, channel) => value + (blue[channel] - value) * percent / 100);
      expect((luminance(color) + 0.05) / (backgroundLuminance + 0.05)).toBeGreaterThanOrEqual(4.5);
    }
  }

  for (const theme of ["dark", "light"]) {
    await expect(page.locator("html")).toHaveClass(theme);
    await checkGradient();
    if (testInfo.project.name === "desktop") {
      await home.hover();
      await checkGradient();
      await page.mouse.move(0, 0);
    }
    await home.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(home).toBeFocused();
    await expect(home).not.toHaveCSS("box-shadow", "none");
    await checkGradient();
    await themeToggle.click();
  }

  if (testInfo.project.name === "mobile") await home.tap();
  else await home.click();
  await expect(page).toHaveURL(/#inicio$/);
  await expect(page.locator("#inicio")).toBeFocused();

  await page.goto("/#contact");
  await home.press("Enter");
  await expect(page).toHaveURL(/#inicio$/);

  await page.emulateMedia({ forcedColors: "active" });
  await expect(monogram).toHaveCSS("background-image", "none");
  await expect(monogram).not.toHaveCSS("color", "rgba(0, 0, 0, 0)");
});
