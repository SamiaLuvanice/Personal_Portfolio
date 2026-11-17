#!/usr/bin/env node
// Gera public/og-image.jpg (1200 × 630) a partir do hero do build (spec 0004).
// Rode depois de `npm run build`:  node scripts/generate-og-image.mjs
// Imagem substituída deve ganhar nome novo ou esperar a validade do cache (ver docs/architecture.md).
import { chromium } from "@playwright/test";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { preview } from "vite";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUTPUT = fileURLToPath(new URL("../public/og-image.jpg", import.meta.url));
const WIDTH = 1200;
const HEIGHT = 630;
const PORT = 4179;

const server = await preview({ root: ROOT, preview: { port: PORT, strictPort: true }, logLevel: "warn" });
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  // Barras fixas e controles não fazem sentido numa imagem estática.
  // O hero ocupa a imagem inteira, com o conteúdo centralizado na vertical.
  await page.addStyleTag({
    content: [
      "nav, [aria-label='Links profissionais'], #inicio a { display: none !important; }",
      `#inicio { min-height: ${HEIGHT}px; padding-top: 0 !important; padding-bottom: 0 !important; display: flex; flex-direction: column; justify-content: center; }`,
      "#inicio > div { width: 100%; }",
    ].join("\n"),
  });
  // As fontes entram depois do evento load (spec 0004): espera as duas famílias.
  await page.waitForFunction(() => {
    const loaded = [...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family);
    return ["Sora", "Space Grotesk"].every((family) => loaded.some((name) => name.includes(family)));
  });
  // Só o retrato do hero: imagens preguiçosas fora da tela podem nunca decodificar.
  await page.locator("#inicio img").evaluate((image) => image.decode());
  await page.screenshot({ path: OUTPUT, type: "jpeg", quality: 85, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  console.log(`${OUTPUT}: ${WIDTH}×${HEIGHT}, ${Math.round(statSync(OUTPUT).size / 1024)} KB`);
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
