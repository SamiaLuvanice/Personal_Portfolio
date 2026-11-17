/** Regras puras da revelação de cor do hero (spec 0006). */

export interface Point {
  x: number;
  y: number;
}

/** Constante de tempo da suavização: segue o ponteiro com atraso leve e assenta em < 1 s. */
const SMOOTHING_TAU_MS = 110;

/** Quadros mais longos que isto (aba que volta do segundo plano) saltam direto ao alvo. */
const MAX_FRAME_MS = 250;

const SETTLE_DISTANCE = 0.5;

/** Posição do ponteiro relativa ao canto superior esquerdo de um elemento. */
export function localPoint(clientX: number, clientY: number, origin: { left: number; top: number }): Point {
  return { x: clientX - origin.left, y: clientY - origin.top };
}

/** Próximo ponto da aproximação suavizada de `current` até `target`. */
export function approach(current: Point, target: Point, factor: number): Point {
  return {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
  };
}

/** Fator de aproximação para um quadro de `dtMs`, independente da taxa de quadros. */
export function smoothingFactor(dtMs: number): number {
  if (dtMs <= 0) return 0;
  if (dtMs >= MAX_FRAME_MS) return 1;
  return 1 - Math.exp(-dtMs / SMOOTHING_TAU_MS);
}

/** Verdadeiro quando o ponto já está, na prática, sobre o alvo. */
export function isSettled(current: Point, target: Point): boolean {
  return Math.hypot(target.x - current.x, target.y - current.y) < SETTLE_DISTANCE;
}
