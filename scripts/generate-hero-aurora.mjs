#!/usr/bin/env node
// Gera em public/hero/ a aurora do hero (spec 0006) pré-renderizada em WebPs pequenos:
//   aurora-mono.webp      geometria em cinza (sempre visível)
//   aurora-color.webp     a mesma geometria nas cores da marca (revelada pelo ponteiro, com máscara CSS)
//   aurora-color-a.webp   colorida já recortada no foco A (modo ambiente/estático, sem máscara CSS)
//   aurora-color-b.webp   colorida já recortada no foco B (modo ambiente)
//   node scripts/generate-hero-aurora.mjs
// Por quê: gradientes de meia tela e máscaras de tela inteira no DOM custavam centenas de ms de
// rasterização no celular (Lighthouse). Uma imagem de 160 × 100 ampliada pelo compositor fica igual,
// porque tudo é suave, e quase não custa. Mude a geometria, as cores ou os focos aqui e rode de novo.
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUTPUT_DIR = fileURLToPath(new URL("../public/hero/", import.meta.url));

/** Focos fixos do modo ambiente: centro e semieixos em fração da área. Calibrados para o celular
 *  em retrato (largura/altura ≈ 0,5), onde a elipse vira círculo na tela; mais largo, ela se alonga. */
const FOCI = {
  a: { x: 0.7, y: 0.32, rx: 0.6, ry: 0.32 },
  b: { x: 0.18, y: 0.6, rx: 0.6, ry: 0.32 },
};
const WIDTH = 160;
const HEIGHT = 100;

/** Geometria de referência do Figma (1440 × 900), em %: [esquerda, topo, largura, altura, rotação]. */
const SHAPES = [
  // Manchas
  [57, -16, 54, 62, -14],
  [-21, 42, 62, 62, 8],
  [69, 67, 43, 47, 0],
  [18, -24, 36, 47, 0],
  [44, 16, 36, 47, 20],
  // Faixas
  [57, 30, 46, 8, -16],
  [-3, 62, 48, 8, 6],
  [68, 85, 34, 6, -5],
];

// Tokens de src/index.css: --tertiary (ciano), --accent (magenta), --primary (laranja).
const CYAN = [188, 88, 48];
const MAGENTA = [305, 100, 47];
const ORANGE = [29, 98, 49];
const GRAY = (lightness) => [240, 6, lightness];
const WHITE = [0, 0, 100];

/** [h, s, l, alfa] por forma, na ordem de SHAPES. */
const PALETTES = {
  mono: [
    [...GRAY(56), 0.5],
    [...GRAY(38), 0.6],
    [...GRAY(45), 0.45],
    [...GRAY(31), 0.5],
    [...GRAY(50), 0.35],
    [...WHITE, 0.32],
    [240, 10, 90, 0.26],
    [...WHITE, 0.22],
  ],
  color: [
    [...CYAN, 0.6],
    [...MAGENTA, 0.55],
    [...CYAN, 0.55],
    [...ORANGE, 0.5],
    [...MAGENTA, 0.55],
    [...CYAN, 0.6],
    [...MAGENTA, 0.55],
    [...MAGENTA, 0.5],
  ],
};

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const images = await page.evaluate(
    ({ width, height, shapes, palettes, foci }) => {
      const render = (palette, focus) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        shapes.forEach(([left, top, w, h, rotate], index) => {
          const [hue, sat, light, alpha] = palette[index];
          ctx.save();
          ctx.translate(((left + w / 2) / 100) * width, ((top + h / 2) / 100) * height);
          ctx.rotate((rotate * Math.PI) / 180);
          ctx.scale((w / 200) * width, (h / 200) * height);
          // Equivale a radial-gradient(closest-side, cor, transparente), sem escurecer a borda.
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
          gradient.addColorStop(0, `hsl(${hue} ${sat}% ${light}% / ${alpha})`);
          gradient.addColorStop(1, `hsl(${hue} ${sat}% ${light}% / 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        if (focus) {
          // Mesmo perfil da máscara CSS do modo ponteiro: 100% no centro, 75% a 40% do raio, 0 na borda.
          ctx.save();
          ctx.globalCompositeOperation = "destination-in";
          ctx.translate(focus.x * width, focus.y * height);
          ctx.scale(focus.rx * width, focus.ry * height);
          const mask = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
          mask.addColorStop(0, "rgb(0 0 0 / 1)");
          mask.addColorStop(0.4, "rgb(0 0 0 / 0.75)");
          mask.addColorStop(1, "rgb(0 0 0 / 0)");
          ctx.fillStyle = mask;
          ctx.fillRect(-2, -2, 4, 4);
          ctx.restore();
        }
        return canvas.toDataURL("image/webp", 0.82);
      };
      return {
        "aurora-mono": render(palettes.mono),
        "aurora-color": render(palettes.color),
        "aurora-color-a": render(palettes.color, foci.a),
        "aurora-color-b": render(palettes.color, foci.b),
      };
    },
    { width: WIDTH, height: HEIGHT, shapes: SHAPES, palettes: PALETTES, foci: FOCI },
  );
  for (const [name, uri] of Object.entries(images)) {
    const [header, data] = uri.split(",");
    if (header !== "data:image/webp;base64") throw new Error(`O Chromium não gerou WebP para "${name}".`);
    const bytes = Buffer.from(data, "base64");
    writeFileSync(`${OUTPUT_DIR}${name}.webp`, bytes);
    console.log(`public/hero/${name}.webp: ${bytes.length} bytes`);
  }
} finally {
  await browser.close();
}
