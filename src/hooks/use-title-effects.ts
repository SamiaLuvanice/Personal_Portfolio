import { type RefObject, useEffect } from "react";
import { approach, isSettled, localPoint, smoothingFactor, type Point } from "@/lib/aurora";

/** Só segue o ponteiro onde há hover fino e o movimento não foi reduzido (spec 0008). */
const POINTER_GLOW_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Fração do título visível para a entrada começar: com 1 px, a varredura terminaria fora da vista. */
const DRAW_THRESHOLD = 0.6;

/** Marca `data-drawn="true"` quando o elemento entra na tela pela primeira vez; não repete. */
export function useDrawOnce(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        element.dataset.drawn = "true";
        observer.disconnect();
      },
      { threshold: DRAW_THRESHOLD },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}

/**
 * Liga o ponteiro ao brilho do título sem re-renderizar: grava `--gx/--gy` com
 * requestAnimationFrame (mesma suavização do hero, spec 0006) e marca `data-glow`.
 */
export function usePointerGlow(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = window.matchMedia(POINTER_GLOW_QUERY);

    let frame = 0;
    let current: Point | null = null;
    let target: Point | null = null;
    let lastTime = 0;

    const write = (point: Point) => {
      element.style.setProperty("--gx", `${point.x.toFixed(1)}px`);
      element.style.setProperty("--gy", `${point.y.toFixed(1)}px`);
    };

    const tick = (time: number) => {
      frame = 0;
      if (!current || !target) return;
      const dt = lastTime ? time - lastTime : 1000 / 60;
      lastTime = time;
      current = approach(current, target, smoothingFactor(dt));
      if (isSettled(current, target)) current = target;
      write(current);
      if (current !== target) frame = window.requestAnimationFrame(tick);
      else lastTime = 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target = localPoint(event.clientX, event.clientY, element.getBoundingClientRect());
      // A primeira entrada nasce no ponteiro; daí em diante, segue com atraso.
      current ??= target;
      element.dataset.glow = "true";
      if (!frame) {
        lastTime = 0;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      element.dataset.glow = "false";
      current = null;
    };

    const attach = () => {
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
    };
    const detach = () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      current = null;
      delete element.dataset.glow;
      element.style.removeProperty("--gx");
      element.style.removeProperty("--gy");
    };
    const sync = () => {
      detach();
      if (media.matches) attach();
    };

    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      detach();
    };
  }, [ref]);
}
