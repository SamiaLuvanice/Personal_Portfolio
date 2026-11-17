#!/usr/bin/env node
// Gera public/og-image.jpg (1200 × 630) a partir do hero do build (spec 0004).
// Rode depois de `npm run build`:  node scripts/generate-og-image.mjs
// Imagem substituída deve ganhar nome novo ou esperar a validade do cache (ver docs/architecture.md).
import { chromium } from "@playwright/test";
import { statSync } from "node:fs";
import { preview } from "vite";

const OUTPUT = "public/og-image.jpg";
const WIDTH = 1200;
const HEIGHT = 630;

const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: "warn" });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await page.goto("http://localhost:4179/", { waitUntil: "networkidle" });
  // Barras fixas e controles não fazem sentido numa imagem estática.
  // O hero ocupa a imagem inteira, com o conteúdo centralizado na vertical.
  await page.addStyleTag({
    content: [
      "nav, [aria-label='Links profissionais'], #inicio a { display: none !important; }",
      `#inicio { min-height: ${HEIGHT}px; padding-top: 0 !important; padding-bottom: 0 !important; display: flex; flex-direction: column; justify-content: center; }`,
      "#inicio > div { width: 100%; }",
    ].join("\n"),
  });
  // As fontes entram depois do evento load (spec 0004): espera as duas faces.
  await page.waitForFunction(() => [...document.fonts].filter((face) => face.status === "loaded").length >= 2);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter((image) => !image.complete).map((image) => image.decode()));
  });
  await page.screenshot({ path: OUTPUT, type: "jpeg", quality: 85, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  console.log(`${OUTPUT}: ${WIDTH}×${HEIGHT}, ${Math.round(statSync(OUTPUT).size / 1024)} KB`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
