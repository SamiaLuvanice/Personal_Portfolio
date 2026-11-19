#!/usr/bin/env node
// Gera a imagem de prévia de link (1200 × 630) a partir do hero do build (specs 0004 e 0006).
// Rode depois de `npm run build`:  node scripts/generate-og-image.mjs
// Captura com movimento reduzido: a aurora sai no estado estático, com o toque fixo de cor.
// A imagem é servida com cache de 7 dias: ao regenerá-la, troque OG_IMAGE por um nome novo e
// atualize as referências (index.html, e2e, docs). Ver docs/architecture.md.
import { chromium } from "@playwright/test";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { preview } from "vite";

const OG_IMAGE = "og-image-2026.jpg";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUTPUT = fileURLToPath(new URL(`../public/${OG_IMAGE}`, import.meta.url));
const WIDTH = 1200;
const HEIGHT = 630;
const PORT = 4179;

const server = await preview({ root: ROOT, preview: { port: PORT, strictPort: true }, logLevel: "warn" });
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  // Barra fixa, botões e ícones não fazem sentido numa imagem estática e seriam cortados na base.
  // Sem a barra, o hero dispensa o recuo do topo e cabe inteiro em 630 px no layout editorial.
  await page.addStyleTag({
    content: [
      "nav, #inicio ul[aria-label='Links profissionais'], #inicio .hero-intro > div { display: none !important; }",
      `#inicio { min-height: ${HEIGHT}px !important; height: ${HEIGHT}px; padding-top: 2.5rem !important; padding-bottom: 3.5rem !important; }`,
    ].join("\n"),
  });
  // As fontes entram depois do evento load (spec 0004). Espera as variáveis, não os fallbacks
  // locais, cujos nomes também contêm "Sora" e "Space Grotesk".
  await page.waitForFunction(() => {
    const loaded = [...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family);
    return ["Sora Variable", "Space Grotesk Variable"].every((family) => loaded.some((name) => name.includes(family)));
  });
  await page.evaluate(() => document.fonts.ready);
  // Só os retratos do hero: imagens preguiçosas fora da tela podem nunca decodificar.
  await page.locator("#inicio img").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  // A aurora só é pedida depois do load (spec 0006): espera o hero ativá-la e a imagem de cada
  // camada visível chegar. Sem camada visível, não captura (sairia sem aurora em silêncio).
  await page.waitForFunction(() => {
    if (document.querySelector("#inicio")?.dataset.motion !== "on") return false;
    const loaded = performance.getEntriesByType("resource").map((entry) => entry.name);
    const urls = [...document.querySelectorAll(".hero-aurora-image")]
      .filter((layer) => layer.offsetParent !== null)
      .map((layer) => getComputedStyle(layer).backgroundImage.match(/url\("(.+)"\)/)?.[1]);
    return urls.length > 0 && urls.every((url) => url && loaded.includes(url));
  });
  // Nenhuma transição ou animação em curso (com timeout, ao contrário de esperar `finished`).
  await page.waitForFunction(() => document.getAnimations().every((animation) => animation.playState !== "running"));
  await page.screenshot({ path: OUTPUT, type: "jpeg", quality: 85, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  console.log(`${OUTPUT}: ${WIDTH}×${HEIGHT}, ${Math.round(statSync(OUTPUT).size / 1024)} KB`);
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
