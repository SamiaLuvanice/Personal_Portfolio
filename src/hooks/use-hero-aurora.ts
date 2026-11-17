import { type RefObject, useEffect } from "react";
import { approach, isSettled, localPoint, smoothingFactor, type Point } from "@/lib/aurora";

/** Só segue o ponteiro onde há hover fino e o movimento não foi reduzido (spec 0006). */
const POINTER_REVEAL_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Liga o ponteiro à revelação de cor do hero sem re-renderizar: grava `--mx/--my` (na seção) e
 * `--px/--py` (no retrato) com requestAnimationFrame e marca `data-reveal` na seção.
 */
export function useAuroraPointer(sectionRef: RefObject<HTMLElement>, photoRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = window.matchMedia(POINTER_REVEAL_QUERY);

    let frame = 0;
    let current: Point | null = null;
    let target: Point | null = null;
    let photoOffset: Point = { x: 0, y: 0 };
    let lastTime = 0;

    const write = (point: Point) => {
      section.style.setProperty("--mx", `${point.x.toFixed(1)}px`);
      section.style.setProperty("--my", `${point.y.toFixed(1)}px`);
      section.style.setProperty("--px", `${(point.x - photoOffset.x).toFixed(1)}px`);
      section.style.setProperty("--py", `${(point.y - photoOffset.y).toFixed(1)}px`);
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
      const box = section.getBoundingClientRect();
      const photo = photoRef.current?.getBoundingClientRect();
      photoOffset = photo ? { x: photo.left - box.left, y: photo.top - box.top } : { x: 0, y: 0 };
      target = localPoint(event.clientX, event.clientY, box);
      // A primeira entrada nasce no ponteiro; daí em diante, segue com atraso.
      current ??= target;
      section.dataset.reveal = "true";
      if (!frame) {
        lastTime = 0;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      section.dataset.reveal = "false";
      current = null;
    };

    const attach = () => {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    };
    const detach = () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      onLeave();
      for (const name of ["--mx", "--my", "--px", "--py"]) section.style.removeProperty(name);
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
  }, [sectionRef, photoRef]);
}

/** Atraso entre o fim do carregamento e o início da deriva (não disputa a primeira pintura). */
const MOTION_START_DELAY_MS = 1500;

/**
 * Controla quando a aurora se move, marcando atributos na seção (o CSS só anima com eles):
 * `data-motion="on"` depois do carregamento + `MOTION_START_DELAY_MS`, e `data-paused` quando o
 * hero sai da tela ou a aba fica oculta.
 */
export function useHeroMotion(sectionRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => {
        section.dataset.motion = "on";
      }, MOTION_START_DELAY_MS);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    let onScreen = true;
    const update = () => {
      section.dataset.paused = String(!onScreen || document.hidden);
    };
    // Várias entradas podem chegar juntas (rolagem rápida): vale a mais recente.
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
      update();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", start);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [sectionRef]);
}
