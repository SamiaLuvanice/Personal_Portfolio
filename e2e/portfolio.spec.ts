/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Critérios da spec 0003. Projetos "desktop" (1280 px) e "mobile" (Pixel 7, toque).
const DARK = "rgb(22, 22, 24)";
const SECTION_ORDER = ["inicio", "projects", "expertise", "experience", "contact"];
const isDesktop = (page: Page) => page.viewportSize()!.width >= 1024;

async function sectionBackground(page: Page, id: string) {
  return page.evaluate((target) => {
    const anchor = document.getElementById(target)!;
    const section = anchor.tagName === "SECTION" ? anchor : anchor.querySelector("section")!;
    return getComputedStyle(section).backgroundColor;
  }, id);
}

async function loadAllSections(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator("#contact section")).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return results.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("seções na ordem certa, alternando escuro e claro, com um único h1", async ({ page }) => {
  await page.goto("/");
  await loadAllSections(page);
  const ids = await page.evaluate((order) => order.filter((id) => document.getElementById(id)), SECTION_ORDER);
  expect(ids).toEqual(SECTION_ORDER);
  const positions = await page.evaluate((order) => order.map((id) => document.getElementById(id)!.getBoundingClientRect().top + window.scrollY), SECTION_ORDER);
  expect([...positions].sort((a, b) => a - b)).toEqual(positions);

  const backgrounds = [];
  for (const id of SECTION_ORDER) backgrounds.push(await sectionBackground(page, id));
  expect(backgrounds[0]).toBe(DARK);
  expect(backgrounds[2]).toBe(DARK);
  expect(backgrounds[4]).toBe(DARK);
  for (const index of [1, 3]) expect(backgrounds[index]).not.toBe(DARK);

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Sâmia Luvanice");
});

test("seções Sobre e Certificados e o botão de tema não existem mais", async ({ page }) => {
  await page.goto("/");
  await loadAllSections(page);
  await expect(page.locator("#about, #certificates")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /tema/i })).toHaveCount(0);
  await expect(page.locator('a[href*="certificates"], a[href="#about"]')).toHaveCount(0);
});

test("metadados de SEO descrevem a Full Stack Developer", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Sâmia Luvanice | Full Stack Developer");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Full Stack Developer/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Full Stack Developer/);
  await expect(page.locator('meta[name="description"]')).not.toHaveAttribute("content", /certificad|em formação/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\//);
});

test("prévia de link usa imagem grande de 1200 × 630 com texto alternativo (spec 0004)", async ({ page, request }) => {
  await page.goto("/");
  const meta = (selector: string) =>
    page.evaluate((target) => document.querySelector(target)?.getAttribute("content") ?? null, selector);
  const image = await meta('meta[property="og:image"]');
  // Nome versionado (og-image-<versão>.jpg): a imagem tem cache de 7 dias e ganha nome novo ao mudar.
  expect(image).toMatch(/^https:\/\/samialuvanicedev\.vercel\.app\/og-image-[\w-]+\.jpg$/);
  const imagePath = new URL(image!).pathname;
  expect(await meta('meta[property="og:image:width"]')).toBe("1200");
  expect(await meta('meta[property="og:image:height"]')).toBe("630");
  expect(await meta('meta[property="og:image:type"]')).toBe("image/jpeg");
  expect(await meta('meta[property="og:image:alt"]')).toMatch(/Sâmia Luvanice.*Full Stack Developer/);
  expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
  expect(await meta('meta[name="twitter:image"]')).toBe(image);
  expect(await meta('meta[name="twitter:image:alt"]')).toMatch(/Sâmia Luvanice/);

  const response = await request.get(imagePath);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("image/jpeg");
  expect((await response.body()).length).toBeLessThanOrEqual(300 * 1024);
  const size = await page.evaluate(async (src) => {
    const image = new Image();
    image.src = src;
    await image.decode();
    return [image.naturalWidth, image.naturalHeight];
  }, imagePath);
  expect(size).toEqual([1200, 630]);
});

test("fontes vêm do próprio site, sem serviço de terceiros (spec 0004)", async ({ page }) => {
  // Qualquer requisição de fonte (ou da folha de estilo do serviço) precisa ser da mesma origem.
  const fonts: string[] = [];
  page.on("request", (req) => {
    if (req.resourceType() === "font" || /fonts\.(googleapis|gstatic)\.com/.test(req.url())) fonts.push(req.url());
  });
  await page.goto("/");
  await loadAllSections(page);
  // As fontes entram depois do evento load; espera as duas faces carregarem.
  await expect
    .poll(() =>
      page.evaluate(() => [...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family.replace(/"/g, ""))),
    )
    .toEqual(expect.arrayContaining(["Sora Variable", "Space Grotesk Variable"]));
  const origin = new URL(page.url()).origin;
  expect(fonts.length).toBeGreaterThan(0);
  expect(fonts.filter((url) => new URL(url).origin !== origin)).toEqual([]);
  const families = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    title: getComputedStyle(document.querySelector("h1")!).fontFamily,
  }));
  expect(families.body).toMatch(/^"?Sora/);
  expect(families.title).toMatch(/^"?Space Grotesk/);
});

/** Largura e limites de cada linha do nome do hero, medidos pelo texto (os spans são block no celular). */
async function heroNameLines(page: Page) {
  return page.evaluate(() => {
    const title = document.getElementById("hero-title")!;
    const box = title.getBoundingClientRect();
    return [...title.querySelectorAll("span")].map((span) => {
      const range = document.createRange();
      range.selectNodeContents(span);
      const text = range.getBoundingClientRect();
      return { left: text.left, right: text.right, width: text.width, min: Math.max(0, box.left), max: Math.min(window.innerWidth, box.right) };
    });
  });
}

test("com a fonte do sistema, o nome do hero cabe e mantém o tamanho (spec 0005)", async ({ page, browser }) => {
  test.skip(!isDesktop(page), "as larguras são definidas no próprio teste");
  for (const width of [320, 360, 390, 768, 1024, 1280]) {
    const fallback = await browser.newPage({ viewport: { width, height: 900 }, baseURL: test.info().project.use.baseURL });
    await fallback.route(/\.woff2$/, (route) => route.abort());
    await fallback.goto("/");
    await fallback.waitForLoadState("networkidle");
    // Confere o cenário: fonte do site bloqueada e fallback local do hero em uso.
    const faces = await fallback.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family.replace(/"/g, ""));
    });
    expect(faces, "a fonte do site deveria estar bloqueada").not.toContain("Space Grotesk Variable");
    expect(
      faces.some((family) => family.startsWith("Space Grotesk Hero Fallback")),
      "nenhuma fonte local compatível (Arial, Liberation Sans, Helvetica ou Roboto)",
    ).toBe(true);
    const withFallback = await heroNameLines(fallback);
    await fallback.close();

    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    // Nome exato: as famílias de fallback também contêm "Space Grotesk".
    await page.waitForFunction(() =>
      [...document.fonts].some((face) => face.family.replace(/"/g, "") === "Space Grotesk Variable" && face.status === "loaded"),
    );
    const loaded = await heroNameLines(page);

    for (const line of withFallback) {
      expect(line.left, `${width}px: linha começa fora do título`).toBeGreaterThanOrEqual(line.min - 0.5);
      expect(line.right, `${width}px: linha passa da borda`).toBeLessThanOrEqual(line.max + 0.5);
    }
    const total = (lines: { width: number }[]) => lines.reduce((sum, line) => sum + line.width, 0);
    expect(Math.abs(total(withFallback) / total(loaded) - 1), `${width}px: largura com fallback`).toBeLessThanOrEqual(0.05);
  }
});

test("hero leva a Projetos e ao Contato e mostra os links profissionais (spec 0006)", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#inicio");
  await expect(hero.getByText("Full Stack Developer")).toBeVisible();
  await expect(hero.getByText(/Transformo ideias em aplicações web completas/)).toBeVisible();
  await expect(hero.getByRole("link", { name: "Explorar projetos" })).toHaveAttribute("href", "#projects");
  await hero.getByRole("link", { name: "Entrar em contato" }).click();
  await expect(page).toHaveURL(/#contact$/);

  const links = hero.getByRole("list", { name: "Links profissionais" });
  await expect(links.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/SamiaLuvanice");
  await expect(links.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/samialuvanice/");
  await expect(links.getByRole("link", { name: "Currículo (PDF)" })).toHaveAttribute("href", "/curriculo.pdf");
  await expect(links.getByRole("link", { name: "E-mail" })).toHaveAttribute("href", /^mailto:samia\.luvanice\.dev@gmail\.com/);
  for (const link of await links.getByRole("link").all()) {
    await link.scrollIntoViewIfNeeded();
    const box = (await link.boundingBox())!;
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
  }
});

// ---- Spec 0009: seções escalonadas ----

test("sem interação, as seções abaixo da dobra ficam completas em até 3 s após o carregamento (spec 0009)", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  for (const id of ["projects-title", "expertise-title", "experience-title", "contact-title"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1, { timeout: 3000 });
  }
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("seguir uma âncora antes de todas as seções aparecerem leva à seção pedida (spec 0009)", async ({ page }) => {
  // Momento ocioso que nunca chega: as seções seguintes só montam pela âncora.
  await page.addInitScript(() => {
    window.requestIdleCallback = () => 0;
    window.cancelIdleCallback = () => {};
  });
  await page.goto("/");
  await expect(page.locator("#projects-title")).toHaveCount(1);
  await expect(page.locator("#contact-title")).toHaveCount(0);

  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Contato" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact-title")).toBeInViewport();
  await page.waitForTimeout(500); // as seções de cima terminam de montar e mudam a altura da página
  await expect(page.locator("#contact-title")).toBeInViewport();
});

test("cards abrem cada projeto em nova aba e o filtro separa autorais de comerciais", async ({ page }) => {
  await page.goto("/#projects");
  const list = page.getByRole("list", { name: "Projetos" });
  const hrefs = () => list.getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  // A seção monta sob demanda e o filtro re-renderiza: lê de novo até estabilizar.
  await expect.poll(hrefs).toEqual([
    "https://bestprice-stage.pages.dev/",
    "https://studynice.vercel.app/",
    "https://www.soundhouse.com.br/",
    "https://lopestech.abeesys.com/",
  ]);
  for (const link of await list.getByRole("link").all()) await expect(link).toHaveAttribute("target", "_blank");

  await page.getByRole("button", { name: "Autorais" }).click();
  await expect.poll(hrefs).toEqual(["https://bestprice-stage.pages.dev/", "https://studynice.vercel.app/"]);
  await expect(page.getByRole("status").filter({ hasText: "projetos autorais" })).toHaveText("2 projetos autorais");
  await page.getByRole("button", { name: "Comerciais" }).click();
  await expect.poll(hrefs).toEqual(["https://www.soundhouse.com.br/", "https://lopestech.abeesys.com/"]);
  await page.getByRole("button", { name: "Todos" }).click();
  await expect.poll(hrefs).toHaveLength(4);

  await expect(page.getByRole("link", { name: /Mais no GitHub/ })).toHaveAttribute("href", "https://github.com/SamiaLuvanice");
});

test("imagens dos cards: P&B com ponteiro e cor no hover e no foco; coloridas em toque", async ({ page }) => {
  await page.goto("/#projects");
  const card = page.getByRole("link", { name: /StudyNice/ });
  const image = card.getByRole("img");
  await image.scrollIntoViewIfNeeded();
  if (isDesktop(page)) {
    await expect(image).toHaveCSS("filter", "grayscale(1)");
    await card.hover();
    await expect(image).toHaveCSS("filter", "none");
    await expect(image).toHaveCSS("transform", "none");
    await page.mouse.move(0, 0);
    await card.focus();
    await expect(image).toHaveCSS("filter", "none");
  } else {
    await expect(image).toHaveCSS("filter", "none");
  }
});

test("com movimento, o hover e o foco do card dão zoom, giram a seta e rolam o nome", async ({ page }) => {
  test.skip(!isDesktop(page), "efeito de hover só existe com ponteiro fino");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#projects");
  const card = page.getByRole("link", { name: /StudyNice/ });
  const image = card.getByRole("img");
  const arrow = card.locator(".project-card-arrow");
  const letter = card.locator(".roll-letter-track").first();
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveCSS("transform", "none");

  await card.hover();
  await expect(image).not.toHaveCSS("transform", "none");
  await expect(arrow).not.toHaveCSS("transform", "none");
  await expect.poll(() => letter.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(0);

  await page.mouse.move(0, 0);
  await card.focus();
  await expect(arrow).not.toHaveCSS("transform", "none");
  await expect.poll(() => letter.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(0);
});

test("imagens fora da dobra são preguiçosas e não competem com o retrato do hero", async ({ page }) => {
  await page.goto("/");
  await loadAllSections(page);
  const portrait = page.getByRole("img", { name: /Retrato de Sâmia Luvanice/ });
  await expect(portrait).toHaveAttribute("fetchpriority", "high");
  expect(await portrait.getAttribute("loading")).not.toBe("lazy");
  const below = page.locator("#projects img, #expertise img");
  expect(await below.count()).toBeGreaterThan(0);
  for (const image of await below.all()) await expect(image).toHaveAttribute("loading", "lazy");

  // O retrato é o primeiro recurso de imagem pedido na abertura.
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "image") requests.push(request.url());
  });
  await page.goto("/");
  await expect.poll(() => requests.length).toBeGreaterThan(0);
  expect(requests[0]).toMatch(/\/hero\/portrait-2026\.webp$/);
});

test("expertise: primeiro item aberto, vários abertos e controle por teclado", async ({ page }) => {
  await page.goto("/#expertise");
  const section = page.locator("#expertise");
  const frontend = section.getByRole("button", { name: /Frontend/ });
  const backend = section.getByRole("button", { name: /Backend/ });
  await expect(frontend).toHaveAttribute("aria-expanded", "true");
  await expect(backend).toHaveAttribute("aria-expanded", "false");
  await expect(section.getByRole("list", { name: "Tecnologias de Frontend" })).toContainText("React");

  await backend.focus();
  await page.keyboard.press("Enter");
  await expect(backend).toHaveAttribute("aria-expanded", "true");
  await expect(frontend).toHaveAttribute("aria-expanded", "true");
  await expect(section.getByRole("list", { name: "Tecnologias de Backend" })).toContainText("FastAPI");
  await expect(section.getByText("Vínculo duplicado")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(backend).toHaveAttribute("aria-expanded", "false");
});

test("experiência lista só Sound House (atual) e Governo do Estado do Ceará", async ({ page }) => {
  await page.goto("/#experience");
  const items = page.locator("#experience li");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText("Sound House");
  await expect(items.nth(0)).toContainText("Atual");
  await expect(items.nth(0)).toContainText("Mai 2024 — atual");
  await expect(items.nth(1)).toContainText("Governo do Estado do Ceará");
  await expect(page.locator("#experience")).not.toContainText("Lopes Tech");
});

test("Iniciar conversa abre o e-mail preenchido e o endereço aparece como texto", async ({ page }) => {
  await page.goto("/#contact");
  const contact = page.locator("#contact");
  await expect(contact.getByRole("link", { name: "Iniciar conversa" })).toHaveAttribute("href", /^mailto:samia\.luvanice\.dev@gmail\.com\?subject=.+&body=.+/);
  await expect(contact.getByText("samia.luvanice.dev@gmail.com", { exact: true })).toBeVisible();
});

test("contato copia o e-mail e confirma (spec 0007)", async ({ page, context }) => {
  await page.goto("/#contact");
  const contact = page.locator("#contact");
  const copy = contact.getByRole("button", { name: "Copiar e-mail" });
  const box = (await copy.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);

  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  if (isDesktop(page)) {
    await copy.focus();
    await page.keyboard.press("Enter");
  } else {
    await copy.tap();
  }
  await expect(copy).toHaveText("Copiado");
  await expect(contact.getByRole("status")).toHaveText("E-mail copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("samia.luvanice.dev@gmail.com");
  await expect(copy).toHaveText("Copiar", { timeout: 4000 });
});

test("barra no topo (desktop) ou embaixo (celular), visível durante a rolagem", async ({ page }) => {
  if (isDesktop(page)) await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  const viewport = page.viewportSize()!;
  const box = async () => (await nav.boundingBox())!;
  await expect(nav.getByRole("link")).toHaveText([/Projetos/, /Expertise/, /Experiência/, /Contato/, ...(isDesktop(page) ? [/Ver projetos/] : [])]);
  if (isDesktop(page)) {
    expect((await box()).y).toBeLessThan(2);
    await expect(nav.getByText("[04]")).toBeVisible();
    await expect(nav.getByText("[05]")).toBeVisible();
    await expect(nav.getByText("[02]")).toBeVisible();
  } else {
    expect(viewport.height - ((await box()).y + (await box()).height)).toBeLessThan(40);
  }
  const initial = (await box()).y;
  await page.evaluate(() => window.scrollTo(0, 2500));
  expect((await box()).y).toBeCloseTo(initial, 0);
});

test("links da barra levam à seção sem cobrir o título e indicam a seção atual", async ({ page }) => {
  await page.goto("/");
  await loadAllSections(page);
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  const targets = [
    ["Projetos", "projects", "PROJETOS"],
    ["Expertise", "expertise", "EXPERTISE"],
    ["Experiência", "experience", "EXPERIÊNCIA"],
    ...(isDesktop(page) ? [["Ver projetos", "projects", "PROJETOS"]] : []),
  ] as const;
  for (const [label, id, title] of targets) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    const heading = page.locator(`#${id}`).getByRole("heading", { level: 2 });
    await expect(heading).toContainText(title);
    await expect(heading).toBeInViewport();
    const navBox = (await nav.boundingBox())!;
    const headingBox = (await heading.boundingBox())!;
    if (isDesktop(page)) expect(headingBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height);
    else expect(headingBox.y + headingBox.height).toBeLessThanOrEqual(navBox.y);
    const current = label === "Ver projetos" ? "Projetos" : label;
    await expect(nav.getByRole("link", { name: current, exact: true })).toHaveAttribute("aria-current", "true");
  }
  await nav.getByRole("link", { name: "Contato", exact: true }).click();
  await expect(page.locator("#contact").getByRole("heading", { level: 2 })).toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(nav.getByRole("link", { name: "Contato" })).toHaveAttribute("aria-current", "true");
});

for (const width of [320, 360, 390, 768, 1440]) {
  test(`sem rolagem horizontal e sem conteúdo sob a barra em ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await loadAllSections(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    for (const link of await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link").all()) {
      if (!(await link.isVisible())) continue;
      const box = (await link.boundingBox())!;
      expect(box.x, await link.innerText()).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, await link.innerText()).toBeLessThanOrEqual(width);
      expect(await link.evaluate((element) => element.scrollWidth <= element.clientWidth + 1), await link.innerText()).toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const nav = (await page.getByRole("navigation", { name: "Navegação principal" }).boundingBox())!;
    const lastLink = page.getByRole("contentinfo").getByRole("link", { name: /Currículo/ });
    const linkBox = (await lastLink.boundingBox())!;
    if (width < 1024) expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(nav.y);
    else expect(linkBox.y).toBeGreaterThanOrEqual(nav.y + nav.height);
  });
}

test("no celular, as áreas de toque têm pelo menos 44 × 44 px", async ({ page }) => {
  test.skip(isDesktop(page), "critério do celular");
  await page.goto("/");
  await loadAllSections(page);
  const targets = page.locator("nav a, #inicio a, #projects button, #projects a, #expertise button, #contact a, footer a");
  for (const target of await targets.all()) {
    if (!(await target.isVisible())) continue;
    const box = (await target.boundingBox())!;
    expect(box.height, await target.innerText()).toBeGreaterThanOrEqual(44);
    expect(box.width, await target.innerText()).toBeGreaterThanOrEqual(44);
  }
});

test("retrato e screenshots têm texto alternativo; marcas d'água ficam ocultas", async ({ page }) => {
  await page.goto("/");
  await loadAllSections(page);
  for (const image of await page.locator("img:not([aria-hidden='true'])").all()) {
    expect((await image.getAttribute("alt"))?.length ?? 0).toBeGreaterThan(10);
  }
  // A cópia colorida do retrato (spec 0006) é decorativa: alt vazio e oculta.
  for (const image of await page.locator("img[aria-hidden='true']").all()) {
    await expect(image).toHaveAttribute("alt", "");
  }
  for (const word of ["CONTATO"]) {
    await expect(page.getByText(word, { exact: true })).toHaveAttribute("aria-hidden", "true");
  }
});

test("home não tem violações de acessibilidade sérias ou críticas", async ({ page }) => {
  await page.goto("/");
  await loadAllSections(page);
  await page.getByRole("button", { name: /Backend/ }).click();
  expect(await seriousViolations(page)).toEqual([]);
});

test("monograma do rodapé usa o degradê do favicon e leva ao início", async ({ page }) => {
  await page.goto("/#contact");
  const home = page.getByRole("contentinfo").getByRole("link", { name: "Sâmia Luvanice", exact: true });
  await expect(home.getByText("SL", { exact: true })).toHaveCSS(
    "background-image",
    /^linear-gradient\(to right bottom, rgb\(236, 72, 153\), rgb\(59, 130, 246\)\)$/,
  );
  await expect(home.getByText("Sâmia Luvanice", { exact: true })).toHaveCSS("background-image", "none");
  await home.click();
  await expect(page).toHaveURL(/#inicio$/);
});

test("rota desconhecida mostra a página 404", async ({ page }) => {
  await page.goto("/rota-que-nao-existe");
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("no tablet (768 px), o hero mostra os links e a barra inferior tem quatro links", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  await expect(page.locator("#inicio").getByRole("list", { name: "Links profissionais" })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(nav.getByRole("link")).toHaveText([/Projetos/, /Expertise/, /Experiência/, /Contato/]);
  const box = (await nav.boundingBox())!;
  expect(1024 - (box.y + box.height)).toBeLessThan(40);
});

test("cada item da Expertise mostra suas tecnologias e a prévia correspondente", async ({ page }) => {
  await page.goto("/#expertise");
  const section = page.locator("#expertise");
  const previews: [string, (scope: ReturnType<Page["locator"]>) => ReturnType<Page["locator"]>][] = [
    ["Frontend", (scope) => scope.getByRole("img", { name: /BestPrice IA/ })],
    ["Backend", (scope) => scope.getByText("Vínculo duplicado")],
    ["Arquitetura & Integrações", (scope) => scope.getByText("API do Mercado Livre")],
    ["DevOps & Workflow", (scope) => scope.getByText("backend $ uv run pytest -q")],
    ["IA no fluxo de engenharia", (scope) => scope.getByText("/implement")],
  ];
  for (const [title, preview] of previews) {
    const trigger = section.getByRole("button", { name: new RegExp(title) });
    if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
    const region = section.getByRole("region", { name: new RegExp(title) });
    await expect(region.getByRole("list", { name: `Tecnologias de ${title}` }).getByRole("listitem").first()).toBeVisible();
    await expect(preview(region)).toBeVisible();
  }
});

test("âncora direta posiciona a seção sem depender de rolagem posterior", async ({ page }) => {
  await page.goto("/#experience");
  await expect(page.locator("#experience").getByRole("heading", { level: 2 })).toBeInViewport();
});

test("com movimento reduzido, abrir um item da Expertise não anima a altura", async ({ page }) => {
  await page.goto("/#expertise");
  const trigger = page.locator("#expertise").getByRole("button", { name: /Backend/ });
  await trigger.click();
  const region = page.locator("#expertise").getByRole("region", { name: /Backend/ });
  expect(await region.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
});

test("foco de teclado não fica inteiramente escondido sob a barra fixa (WCAG 2.4.11)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  // As fontes usam font-display: swap; espera a fonte de título carregar para medir o layout final.
  await page.waitForFunction(() =>
    [...document.fonts].some((face) => face.family.includes("Space Grotesk") && face.status === "loaded"),
  );
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  // Chega a cada alvo pelo Tab, como faria quem navega pelo teclado.
  const footer = page.getByRole("contentinfo");
  const steps = [
    { name: "Todos", before: page.locator("#inicio").getByRole("link", { name: "E-mail" }), target: page.getByRole("button", { name: "Todos" }) },
    { name: "Currículo", before: footer.getByRole("link", { name: /LinkedIn/ }), target: footer.getByRole("link", { name: /Currículo/ }) },
  ];
  for (const { name, before, target } of steps) {
    await before.focus();
    await page.keyboard.press("Tab");
    await expect(target).toBeFocused();
    // WCAG 2.4.11 (AA): o item focado nunca fica inteiramente escondido sob a barra. Com o
    // scroll-padding ele costuma ficar todo visível; o Chrome às vezes ignora o padding.
    const navTop = (await nav.boundingBox())!.y;
    await expect.poll(async () => (await target.boundingBox())!.y, { message: name }).toBeLessThan(navTop - 8);
  }
});

test("em cores forçadas, as marcas d'água somem e a seção ativa segue marcada", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/#expertise");
  await expect(page.locator(".ghost-word").first()).toBeHidden();
  const active = page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Expertise", exact: true });
  await expect(active).toHaveAttribute("aria-current", "true");
  await expect(active).toHaveCSS("text-decoration-line", "underline");
});

// ---- Spec 0006: Hero Liquid Aurora ----

/** Estado da revelação: atributo, centro (px na seção), raio e opacidade das camadas de cor. */
async function revealState(page: Page) {
  return page.evaluate(() => {
    const section = document.getElementById("inicio")!;
    const style = getComputedStyle(section);
    const probe = document.createElement("div");
    probe.style.width = "var(--reveal-r)";
    section.appendChild(probe);
    const radius = probe.getBoundingClientRect().width;
    probe.remove();
    const box = section.getBoundingClientRect();
    return {
      reveal: section.dataset.reveal,
      mx: parseFloat(style.getPropertyValue("--mx")),
      my: parseFloat(style.getPropertyValue("--my")),
      mxRaw: style.getPropertyValue("--mx").trim(),
      radius,
      heroHeight: box.height,
      top: box.top,
      left: box.left,
      auroraOpacity: Number(getComputedStyle(document.querySelector(".hero-aurora-color")!).opacity),
      altOpacity: Number(getComputedStyle(document.querySelector(".hero-aurora-color-alt")!).opacity),
      photoOpacity: Number(getComputedStyle(document.querySelector(".hero-portrait-color")!).opacity),
      portraitFilter: getComputedStyle(document.querySelector(".hero-portrait")!).filter,
      running: document
        .getAnimations()
        .filter((animation) => {
          const target = (animation.effect as KeyframeEffect | null)?.target;
          return target instanceof Element && section.contains(target) && animation.playState === "running";
        }).length,
    };
  });
}

test.describe("hero Liquid Aurora (spec 0006)", () => {
  test("com mouse, a revelação segue o ponteiro e apaga ao sair", async ({ page }) => {
    test.skip(!isDesktop(page), "precisa de hover e ponteiro fino");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const idle = await revealState(page);
    expect(idle.reveal).toBe("false");
    expect(idle.auroraOpacity).toBe(0);
    expect(idle.portraitFilter).toContain("grayscale(1)");

    // A aurora entra depois do carregamento; a revelação só faz sentido com ela presente.
    await expect(page.locator("#inicio")).toHaveAttribute("data-motion", "on");
    await page.mouse.move(300, 400);
    await page.mouse.move(820, 300, { steps: 8 });
    await page.waitForTimeout(1000);
    const active = await revealState(page);
    expect(active.reveal).toBe("true");
    expect(Math.hypot(active.mx - (820 - active.left), active.my - (300 - active.top))).toBeLessThanOrEqual(40);
    expect(active.auroraOpacity).toBe(1);
    expect(active.radius).toBeGreaterThan(0);
    expect(active.radius).toBeLessThanOrEqual(active.heroHeight / 2);

    // A barra fixa fica fora da seção: passar o ponteiro para ela é sair do hero.
    await page.mouse.move(640, 10, { steps: 4 });
    await page.waitForTimeout(1500);
    const gone = await revealState(page);
    expect(gone.reveal).toBe("false");
    expect(gone.auroraOpacity).toBe(0);
    expect(gone.photoOpacity).toBe(0);
  });

  test("com movimento reduzido, nada segue o ponteiro e nada se move", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#inicio")).toHaveAttribute("data-motion", "on");
    await page.mouse.move(700, 300, { steps: 6 });
    await page.waitForTimeout(400);
    const state = await revealState(page);
    expect(state.reveal).toBe("false");
    expect(state.running).toBe(0);
  });

  test("sem hover (toque), o foco de cor ambiente passeia sozinho e é discreto", async ({ page }) => {
    test.skip(isDesktop(page), "só em aparelho de toque");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    expect(await page.evaluate(() => matchMedia("(hover: none)").matches)).toBe(true);
    await expect(page.locator("#inicio")).toHaveAttribute("data-motion", "on");
    // Dois focos fixos (rosto e lateral) se alternam: a cor sai de um e aparece no outro.
    await page.waitForTimeout(300);
    const first = await revealState(page);
    await page.waitForTimeout(3000);
    const second = await revealState(page);
    expect(second.auroraOpacity).toBeGreaterThan(first.auroraOpacity);
    expect(second.altOpacity).toBeLessThan(first.altOpacity);
    for (const state of [first, second]) {
      expect(Math.max(state.auroraOpacity, state.altOpacity)).toBeGreaterThan(0);
      expect(Math.max(state.auroraOpacity, state.altOpacity, state.photoOpacity)).toBeLessThan(1);
    }
  });

  test("com o hero fora da tela, a aurora pausa", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await expect(page.locator("#inicio")).toHaveAttribute("data-motion", "on");
    await expect(page.locator("#inicio")).toHaveAttribute("data-paused", "false");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.locator("#inicio")).toHaveAttribute("data-paused", "true");
    await expect.poll(async () => (await revealState(page)).running).toBe(0);
  });

  test("no celular, o nome não cobre o rosto e nada passa da largura da tela", async ({ page }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await page.waitForFunction(() => [...document.fonts].some((face) => face.family.includes("Space Grotesk") && face.status === "loaded"));
      const layout = await page.evaluate(() => {
        const title = document.getElementById("hero-title")!.getBoundingClientRect();
        const photo = document.querySelector(".hero-photo")!.getBoundingClientRect();
        const texts = [...document.querySelectorAll("#inicio p, #inicio h1 span, #inicio a")].map((el) => el.getBoundingClientRect().right);
        return { titleBottom: title.bottom, photoTop: photo.top, photoThird: photo.top + photo.height / 3, maxRight: Math.max(...texts), scroll: document.documentElement.scrollWidth };
      });
      // A caixa do nome não entra no terço superior da foto (onde está o rosto).
      expect(layout.titleBottom, `${width}px`).toBeLessThanOrEqual(layout.photoTop);
      expect(layout.maxRight, `${width}px`).toBeLessThanOrEqual(width);
      expect(layout.scroll, `${width}px`).toBeLessThanOrEqual(width);
    }
  });

  test("a aurora só é pedida depois do carregamento e não compete com o retrato", async ({ page }) => {
    const images: { url: string; at: number }[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "image") images.push({ url: request.url(), at: Date.now() });
    });
    let loadedAt = 0;
    page.on("load", () => (loadedAt = Date.now()));
    await page.goto("/");
    await expect(page.locator("#inicio")).toHaveAttribute("data-motion", "on");
    await expect.poll(() => images.filter((image) => /aurora-/.test(image.url)).length).toBeGreaterThan(0);
    const portrait = images.findIndex((image) => /\/hero\/portrait-2026\.webp$/.test(image.url));
    const firstAurora = images.findIndex((image) => /aurora-/.test(image.url));
    expect(portrait).toBeGreaterThanOrEqual(0);
    expect(portrait).toBeLessThan(firstAurora);
    for (const image of images.filter((entry) => /aurora-/.test(entry.url))) expect(image.at).toBeGreaterThanOrEqual(loadedAt);
  });

  test("em cores forçadas, aurora e cor da foto somem", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await page.goto("/");
    // Depois do carregamento as camadas coloridas existem; só as cores forçadas as escondem.
    await expect(page.locator("#inicio")).toHaveAttribute("data-motion", "on");
    await expect(page.locator(".hero-aurora")).toBeHidden();
    for (const copy of await page.locator(".hero-portrait-color").all()) await expect(copy).toBeHidden();
    const name = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.color = "CanvasText";
      document.body.appendChild(probe);
      const system = getComputedStyle(probe).color;
      probe.remove();
      const lines = [...document.querySelectorAll("#hero-title span")].map((span) => {
        const style = getComputedStyle(span);
        return { color: style.color, stroke: style.getPropertyValue("-webkit-text-stroke-width") };
      });
      return { system, lines };
    });
    for (const line of name.lines) {
      expect(line.color).toBe(name.system);
      expect(line.stroke).toBe("0px");
    }
  });
});

// ---- Spec 0008: título interativo do Contato ----

/** Estado do título: entrada, brilho (centro em px no título, raio e opacidade) e alinhamento. */
async function contactTitleState(page: Page) {
  return page.evaluate(() => {
    const title = document.getElementById("contact-title")!;
    const outline = title.querySelector<HTMLElement>(".contact-title-outline")!;
    const glow = title.querySelector<HTMLElement>(".contact-title-glow")!;
    const lineRects = (node: Node) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      return [...range.getClientRects()].map((rect) => [rect.left, rect.top, rect.width].map(Math.round));
    };
    const box = title.getBoundingClientRect();
    return {
      drawn: title.dataset.drawn,
      glow: title.dataset.glow,
      gx: parseFloat(title.style.getPropertyValue("--gx")),
      gy: parseFloat(title.style.getPropertyValue("--gy")),
      left: box.left,
      top: box.top,
      height: box.height,
      glowOpacity: Number(getComputedStyle(glow).opacity),
      outlineClip: getComputedStyle(outline).clipPath,
      outlineDisplay: getComputedStyle(outline).display,
      glowDisplay: getComputedStyle(glow).display,
      textLines: lineRects(title.firstChild!),
      outlineLines: lineRects(outline),
      running: title.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length,
    };
  });
}

/** A seção Contato é carregada sob demanda: espera o título existir antes de centralizá-lo. */
/**
 * Pixels saturados (cor da marca) numa captura da tela, separados pela distância a um ponto
 * da página: até `radius` ("near") e além dele ("far"). O preenchimento, o contorno e o fundo são
 * neutros, então só o brilho produz pixels saturados no título.
 */
async function brandPixels(page: Page, clip: { x: number; y: number; width: number; height: number }, center: { x: number; y: number }, radius: number) {
  const png = (await page.screenshot({ clip })).toString("base64");
  return page.evaluate(
    async ({ png, clip, center, radius }) => {
      const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext("2d")!;
      context.drawImage(bitmap, 0, 0);
      const { data } = context.getImageData(0, 0, bitmap.width, bitmap.height);
      const scale = bitmap.width / clip.width;
      let near = 0;
      let far = 0;
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        if (Math.max(r, g, b) - Math.min(r, g, b) < 90) continue;
        const pixel = i / 4;
        const x = clip.x + (pixel % bitmap.width) / scale;
        const y = clip.y + Math.floor(pixel / bitmap.width) / scale;
        if (Math.hypot(x - center.x, y - center.y) <= radius) near++;
        else far++;
      }
      return { near, far };
    },
    { png, clip, center, radius },
  );
}

async function scrollToContactTitle(page: Page) {
  await page.locator("#contact-title").waitFor({ state: "attached" });
  await page.evaluate(() => document.getElementById("contact-title")!.scrollIntoView({ block: "center" }));
}

test.describe("título interativo do Contato (spec 0008)", () => {
  test("é um único h2 lido uma vez, sem violações de acessibilidade com o efeito visível", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/#contact");
    await scrollToContactTitle(page);
    const contact = page.locator("#contact");
    await expect(contact.getByRole("heading")).toHaveCount(1);
    await expect(contact.getByRole("heading", { level: 2 })).toHaveAccessibleName("Vamos construir algo relevante?");
    await expect(contact.getByRole("region", { name: "Vamos construir algo relevante?" })).toHaveCount(1);
    // Contorno desenhado e, no desktop, brilho aceso: o axe avalia o estado que a maioria vê.
    await expect(page.locator("#contact-title")).toHaveAttribute("data-drawn", "true");
    await expect.poll(async () => (await contactTitleState(page)).outlineClip, { timeout: 4000 }).toBe("inset(0px 0% 0px 0px)");
    if (isDesktop(page)) {
      const box = (await page.locator("#contact-title").boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
      await expect(page.locator("#contact-title")).toHaveAttribute("data-glow", "true");
    }
    expect(await seriousViolations(page)).toEqual([]);
  });

  test("o contorno se desenha ao entrar na tela, termina em até 4 s e não se repete", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    // "Só ao entrar na tela" é coberto no teste de unidade: aqui, carregar as seções já as mostra no celular.
    await page.goto("/");
    await scrollToContactTitle(page);
    await expect(page.locator("#contact-title")).toHaveAttribute("data-drawn", "true");
    await expect.poll(async () => (await contactTitleState(page)).outlineClip, { timeout: 4000 }).toBe("inset(0px 0% 0px 0px)");
    expect((await contactTitleState(page)).running).toBe(0);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await scrollToContactTitle(page);
    await page.waitForTimeout(300);
    const again = await contactTitleState(page);
    expect(again.outlineClip).toBe("inset(0px 0% 0px 0px)");
    expect(again.running).toBe(0);
  });

  test("com mouse, o brilho segue o ponteiro e apaga ao sair", async ({ page }) => {
    test.skip(!isDesktop(page), "precisa de hover e ponteiro fino");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/#contact");
    await scrollToContactTitle(page);
    await expect.poll(async () => (await contactTitleState(page)).outlineClip, { timeout: 4000 }).toBe("inset(0px 0% 0px 0px)");
    const idle = await contactTitleState(page);
    const clip = { x: idle.left, y: idle.top, width: (await page.locator("#contact-title").boundingBox())!.width, height: idle.height };
    const x = idle.left + 300;
    const y = idle.top + idle.height / 3;
    const halfHeight = idle.height / 2;
    expect(idle.glowOpacity).toBe(0);
    expect(await brandPixels(page, clip, { x, y }, halfHeight)).toEqual({ near: 0, far: 0 });

    await page.mouse.move(x - 120, y + 10);
    await page.mouse.move(x, y, { steps: 8 });
    await page.waitForTimeout(1000);
    const active = await contactTitleState(page);
    expect(active.glow).toBe("true");
    expect(active.glowOpacity).toBe(1);
    expect(Math.hypot(active.gx - (x - active.left), active.gy - (y - active.top))).toBeLessThanOrEqual(40);
    // O brilho é pintado de fato nas cores da marca perto do cursor, e nada colorido passa de
    // metade da altura do título (o raio máximo do critério).
    const lit = await brandPixels(page, clip, { x, y }, halfHeight);
    expect(lit.near).toBeGreaterThan(50);
    expect(lit.far).toBe(0);

    await page.mouse.move(x, active.top + active.height + 80, { steps: 4 });
    await page.waitForTimeout(1000);
    const gone = await contactTitleState(page);
    expect(gone.glow).toBe("false");
    expect(gone.glowOpacity).toBe(0);
    expect(await brandPixels(page, clip, { x, y }, halfHeight)).toEqual({ near: 0, far: 0 });
  });

  test("no toque, a página rola e nenhum brilho aparece", async ({ page }) => {
    test.skip(isDesktop(page), "só em aparelho de toque");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/#contact");
    await scrollToContactTitle(page);
    const before = await page.evaluate(() => window.scrollY);
    const box = (await page.locator("#contact-title").boundingBox())!;
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    // Arrastar sobre o título rola a página (o título não bloqueia o toque).
    const session = await page.context().newCDPSession(page);
    await session.send("Input.synthesizeScrollGesture", {
      x: Math.round(box.x + box.width / 2),
      y: Math.round(box.y + box.height / 2),
      yDistance: -200,
      gestureSourceType: "touch",
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).not.toBe(before);
    const state = await contactTitleState(page);
    expect(state.glow).not.toBe("true");
    expect(state.glowOpacity).toBe(0);
  });

  test("com movimento reduzido, o título fica só preenchido e nada se move", async ({ page }) => {
    await page.goto("/#contact");
    await scrollToContactTitle(page);
    if (isDesktop(page)) {
      const box = (await page.locator("#contact-title").boundingBox())!;
      await page.mouse.move(box.x + 200, box.y + 40, { steps: 6 });
      await page.waitForTimeout(400);
    }
    const state = await contactTitleState(page);
    expect(state.outlineDisplay).toBe("none");
    expect(state.glowDisplay).toBe("none");
    expect(state.glow).not.toBe("true");
    expect(state.running).toBe(0);
  });

  test("em cores forçadas, o contorno e o brilho somem e o título usa a cor do sistema", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "no-preference" });
    await page.goto("/#contact");
    await scrollToContactTitle(page);
    await expect(page.locator("#contact-title")).toHaveAttribute("data-drawn", "true");
    await expect(page.locator(".contact-title-outline")).toBeHidden();
    await expect(page.locator(".contact-title-glow")).toBeHidden();
    const colors = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.color = "CanvasText";
      document.body.appendChild(probe);
      const system = getComputedStyle(probe).color;
      probe.remove();
      return { system, title: getComputedStyle(document.getElementById("contact-title")!).color };
    });
    expect(colors.title).toBe(colors.system);
  });

  test("o contorno coincide com as letras e o contraste do texto se mantém em cada largura", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/#contact");
    await page.waitForFunction(() => document.fonts.status === "loaded");
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await scrollToContactTitle(page);
      await page.waitForTimeout(150);
      const state = await contactTitleState(page);
      expect(state.outlineLines, `${width}px`).toEqual(state.textLines);
      const layout = await page.evaluate(() => {
        const title = document.getElementById("contact-title")!;
        const colors = [title, ...title.querySelectorAll("span")].map((el) => getComputedStyle(el).color);
        return { colors, scroll: document.documentElement.scrollWidth, right: title.getBoundingClientRect().right };
      });
      // As cópias pintam o preenchimento com a mesma cor do título: o contraste do texto não muda.
      expect(new Set(layout.colors).size, `${width}px`).toBe(1);
      expect(layout.scroll, `${width}px`).toBeLessThanOrEqual(width);
      expect(layout.right, `${width}px`).toBeLessThanOrEqual(width);
    }
  });
});
