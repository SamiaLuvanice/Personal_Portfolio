import { describe, expect, it } from "vitest";
import { approach, isSettled, localPoint, smoothingFactor } from "./aurora";

describe("localPoint", () => {
  it("converte a posição do ponteiro para coordenadas dentro do elemento", () => {
    expect(localPoint(250, 180, { left: 100, top: 30 })).toEqual({ x: 150, y: 150 });
  });
});

describe("approach", () => {
  it("anda uma fração da distância até o alvo a cada passo", () => {
    expect(approach({ x: 0, y: 100 }, { x: 100, y: 0 }, 0.25)).toEqual({ x: 25, y: 75 });
  });
});

describe("smoothingFactor", () => {
  it("dá cerca de 0,14 num quadro de 60 Hz", () => {
    expect(smoothingFactor(1000 / 60)).toBeCloseTo(0.14, 2);
  });

  it.each([20, 60, 144])("converge em menos de 1 s a %i quadros por segundo", (fps) => {
    let point = { x: 0, y: 0 };
    const target = { x: 1200, y: 800 };
    const dt = 1000 / fps;
    let elapsed = 0;
    while (!isSettled(point, target) && elapsed < 5000) {
      point = approach(point, target, smoothingFactor(dt));
      elapsed += dt;
    }
    expect(elapsed).toBeLessThan(1000);
  });

  it("limita quadros muito longos (aba voltando do segundo plano) a um salto direto", () => {
    expect(smoothingFactor(5000)).toBe(1);
    expect(smoothingFactor(0)).toBe(0);
  });
});

describe("isSettled", () => {
  it("considera assentado só quando o ponto está a menos de meio pixel do alvo", () => {
    expect(isSettled({ x: 10.3, y: 9.8 }, { x: 10, y: 10 })).toBe(true);
    expect(isSettled({ x: 9, y: 10 }, { x: 10, y: 10 })).toBe(false);
  });
});
