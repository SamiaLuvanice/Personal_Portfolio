import { lazy, startTransition, Suspense, useCallback, useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

// Seções abaixo da dobra em chunks próprios: mantêm o primeiro render leve (LCP do retrato).
const loaders = {
  projects: () => import("@/components/Projects"),
  expertise: () => import("@/components/Expertise"),
  experience: () => import("@/components/Experience"),
  contact: () => import("@/components/Contact"),
};

const SECTIONS = [
  { id: "projects", Component: lazy(loaders.projects), minHeight: "min-h-[60rem]" },
  { id: "expertise", Component: lazy(loaders.expertise), minHeight: "min-h-[40rem]" },
  { id: "experience", Component: lazy(loaders.experience), minHeight: "min-h-[20rem]" },
  { id: "contact", Component: lazy(loaders.contact), minHeight: "min-h-[30rem]" },
];

/**
 * Avisa quando a seção terminou de montar. Fica dentro do mesmo Suspense da seção, então só
 * monta junto com ela, depois que o chunk chega.
 */
const SectionReady = ({ onReady }: { onReady: () => void }) => {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
};

/** Próxima oportunidade ociosa (ou o próximo ciclo, onde não há requestIdleCallback). */
const whenIdle = (callback: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 300 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 0);
  return () => window.clearTimeout(id);
};

/**
 * Montar tudo de uma vez quando há um destino de rolagem: uma âncora no endereço, ou uma recarga
 * ou volta no histórico, em que o navegador restaura a posição anterior e precisa da página inteira.
 */
const needsFullPage = () => {
  if (window.location.hash.length > 1) return true;
  const navigation = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
  return navigation?.type === "reload" || navigation?.type === "back_forward";
};

/** Sinais de que a pessoa assumiu a rolagem (inclui arrastar a barra de rolagem). */
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

const Index = () => {
  // Seções abaixo da dobra montam uma por vez, cada uma numa tarefa curta, em vez de todas numa
  // tarefa longa logo depois da primeira tela (spec 0009). Com um destino de rolagem (âncora,
  // recarga, volta no histórico ou âncora seguida durante a montagem), montam todas de uma vez.
  const [mountedCount, setMountedCount] = useState(() => (needsFullPage() ? SECTIONS.length : 1));
  const cancelNext = useRef<() => void>();
  const allMounted = useRef(mountedCount === SECTIONS.length);
  allMounted.current = mountedCount === SECTIONS.length;
  const mountNext = useCallback(() => {
    cancelNext.current?.();
    // Transição: a renderização de cada seção também cede a thread em fatias.
    cancelNext.current = whenIdle(() =>
      startTransition(() => setMountedCount((count) => Math.min(count + 1, SECTIONS.length))),
    );
  }, []);

  useEffect(() => {
    // Os chunks continuam sendo baixados juntos, já no início; só a montagem é escalonada.
    for (const load of Object.values(loaders)) load().catch(() => {});

    const currentId = () => {
      try {
        return decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return ""; // fragmento malformado (ex.: "#%"): não há destino
      }
    };

    // Numa SPA o navegador rola até o fragmento antes de a seção existir (ou antes de as seções
    // acima dele terem a altura final). Depois que os chunks carregam, refaz a rolagem até o
    // destino a cada mudança de altura da página, por até 2 s ou até a pessoa rolar por conta própria.
    let stopFollowing = () => {};
    const followTarget = () => {
      stopFollowing();
      const id = currentId();
      if (!id) return;
      let done = false;
      let observer: ResizeObserver | null = null;
      let timer = 0;
      const realign = () => {
        // "instant": o realinhamento não pode virar uma animação recomeçada a cada mudança de altura.
        if (!done && currentId() === id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      };
      const stop = () => {
        done = true;
        observer?.disconnect();
        window.clearTimeout(timer);
        for (const type of USER_SCROLL_EVENTS) window.removeEventListener(type, stop);
      };
      stopFollowing = stop;
      for (const type of USER_SCROLL_EVENTS) window.addEventListener(type, stop, { passive: true });
      Promise.all(Object.values(loaders).map((load) => load()))
        .then(() => {
          if (done) return;
          window.requestAnimationFrame(realign);
          if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(realign);
            observer.observe(document.body);
          }
          timer = window.setTimeout(stop, 2000);
        })
        // Falha de rede num chunk: o Suspense da seção trata; aqui só não há realinhamento.
        .catch(stop);
    };

    // Seguir uma âncora antes de todas as seções aparecerem: monta as restantes e acompanha o
    // destino. Depois disso não há o que realinhar, e a rolagem suave do navegador segue intacta.
    const onHashChange = () => {
      if (allMounted.current) return;
      setMountedCount(SECTIONS.length);
      followTarget();
    };
    followTarget();
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      stopFollowing();
      cancelNext.current?.();
    };
  }, []);

  return (
    <div className="portfolio-page min-h-screen bg-[hsl(var(--surface-dark))]">
      <Navbar />
      <main>
        <Hero />
        {SECTIONS.map(({ id, Component, minHeight }, index) => (
          <div key={id} id={id} tabIndex={-1} className="focus:outline-none">
            {index < mountedCount ? (
              <Suspense fallback={<div className={minHeight} />}>
                <Component />
                <SectionReady onReady={mountNext} />
              </Suspense>
            ) : (
              <div className={minHeight} />
            )}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
